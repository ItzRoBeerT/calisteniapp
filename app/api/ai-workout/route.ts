import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { RecentWorkoutData } from '@/types/Workout';

type WorkoutType = 'push' | 'pull' | 'legs' | 'full_body';
type DifficultyAdjustment = 'easier' | 'same' | 'harder';

interface AIExercise {
  id: number;
  name: string;
  category?: string;
  muscle_group?: string[];
  difficulty?: number;
}

interface RequestBody {
  exercises: AIExercise[];
  recentWorkout?: RecentWorkoutData | null;
  workoutType: WorkoutType;
  difficultyAdjustment: DifficultyAdjustment;
  locale: string;
}

const WORKOUT_TYPE_MUSCLES: Record<WorkoutType, string[]> = {
  push: ['chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps', 'forearms'],
  legs: ['legs', 'glutes', 'calves', 'hamstrings', 'quadriceps'],
  full_body: ['chest', 'back', 'shoulders', 'legs', 'core'],
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  });

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const body: RequestBody = await req.json();
  const { exercises, recentWorkout, workoutType, difficultyAdjustment, locale } = body;

  const targetMuscles = WORKOUT_TYPE_MUSCLES[workoutType];

  // Filter exercises relevant to the workout type
  const relevantExercises = exercises.filter(
    (ex) =>
      ex.category === workoutType ||
      ex.muscle_group?.some((m) => targetMuscles.includes(m))
  );

  // Use all exercises if no relevant ones found
  const exercisePool = relevantExercises.length >= 4 ? relevantExercises : exercises;

  const exerciseList = exercisePool
    .map((ex) => `- ID: ${ex.id}, Name: "${ex.name}", Muscles: [${(ex.muscle_group || []).join(', ')}], Difficulty: ${ex.difficulty ?? 'unknown'}/5`)
    .join('\n');

  let historyContext = '';
  if (recentWorkout) {
    const recentExercises = recentWorkout.exercises
      .map((ex) => `  - ${ex.name}: ${ex.sets}x${ex.reps} reps, ${ex.rest}s rest`)
      .join('\n');
    historyContext = `
User's most recent workout ("${recentWorkout.name}", difficulty: ${recentWorkout.difficulty || 'unknown'}):
${recentExercises}
Difficulty adjustment requested: ${difficultyAdjustment}
- If "easier": reduce sets/reps by ~20%, increase rest by ~20%
- If "harder": increase sets/reps by ~20%, reduce rest by ~20%
- If "same": use similar volume`;
  }

  const languageInstruction = locale === 'es'
    ? 'Respond with the workout name and description in Spanish.'
    : 'Respond with the workout name and description in English.';

  const systemPrompt = `You are a calisthenics workout generator. Generate a ${workoutType.replace('_', ' ')} workout using ONLY exercises from the provided list.

Rules:
- Select 4-6 exercises from the list
- Use only the exact exercise IDs and names from the list
- Focus on muscles: ${targetMuscles.join(', ')}
- Sets: 2-5, Reps: 5-20, Rest: 30-120 seconds
- Choose difficulty (Beginner/Intermediate/Advanced/Expert) based on the exercises selected
${historyContext}
${languageInstruction}

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "name": "workout name",
  "description": "1-2 sentence description",
  "difficulty": "Beginner|Intermediate|Advanced|Expert",
  "exercises": [
    { "exercise_id": <number>, "name": "<exact name from list>", "sets": <number>, "reps": <number>, "rest": <number> }
  ]
}`;

  const userMessage = `Available exercises for ${workoutType} workout:\n${exerciseList}`;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    // Strip any markdown fences just in case
    const jsonStr = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const workout = JSON.parse(jsonStr);

    return NextResponse.json(workout);
  } catch (err) {
    console.error('AI workout generation error:', err);
    return NextResponse.json({ error: 'Failed to generate workout' }, { status: 500 });
  }
}

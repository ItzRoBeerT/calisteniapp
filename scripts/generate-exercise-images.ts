/**
 * Script para generar imágenes de ejercicios usando OpenAI
 *
 * Uso:
 *   pnpm tsx scripts/generate-exercise-images.ts                     # Genera todas las imágenes
 *   pnpm tsx scripts/generate-exercise-images.ts --limit 1           # Solo una imagen (prueba)
 *   pnpm tsx scripts/generate-exercise-images.ts --ids 1,2,3         # Ejercicios específicos
 *   pnpm tsx scripts/generate-exercise-images.ts --dry-run           # Solo muestra prompts
 *   pnpm tsx scripts/generate-exercise-images.ts --skip-existing     # Salta los que ya existen
 *
 * Variables de entorno requeridas:
 *   OPENAI_API_KEY
 *
 * Flujo por ejercicio:
 *   1. El LLM (gpt-4o) genera un prompt de imagen detallado basado en el ejercicio
 *   2. gpt-image-1 genera la imagen usando la referencia de estilo
 *   3. La imagen se guarda en public/images/exercises/{id}.png
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

// ─── Configuración ───────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/exercises');
const REFERENCE_IMAGE_PATH = path.join(process.cwd(), 'public/images/reference_image.png');
const EXERCISES_PATH = path.join(process.cwd(), 'data/exercises.json');
const MESSAGES_ES_PATH = path.join(process.cwd(), 'messages/es.json');
const DELAY_BETWEEN_REQUESTS_MS = 3000; // Evitar rate limiting

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ExerciseData {
	id: number;
	image: string;
	difficulty: number;
	muscle_group: string[];
	category: string;
	type: string;
	equipment: string[];
}

interface ExerciseTranslation {
	name: string;
	description: string;
}

interface Exercise extends ExerciseData {
	name: string;
	description: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
	const args = process.argv.slice(2);
	const result = {
		ids: null as number[] | null,
		dryRun: false,
		skipExisting: false,
		limit: null as number | null,
	};

	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--dry-run') result.dryRun = true;
		if (args[i] === '--skip-existing') result.skipExisting = true;
		if (args[i] === '--ids' && args[i + 1]) {
			result.ids = args[i + 1].split(',').map(Number);
		}
		if (args[i] === '--limit' && args[i + 1]) {
			result.limit = Number(args[i + 1]);
		}
	}

	return result;
}

function loadExercises(): Exercise[] {
	const base: ExerciseData[] = JSON.parse(fs.readFileSync(EXERCISES_PATH, 'utf-8'));
	const messages = JSON.parse(fs.readFileSync(MESSAGES_ES_PATH, 'utf-8'));
	const translations: Record<string, ExerciseTranslation> = messages.Exercises || {};

	return base.map((e) => {
		const t = translations[String(e.id)] || { name: `Exercise ${e.id}`, description: '' };
		return { ...e, name: t.name, description: t.description };
	});
}

// ─── Prompt del LLM ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert at writing image generation prompts for calisthenics exercise illustrations.

The target style is:
- Bold black and white graphic illustration (woodcut/linocut print aesthetic)
- High contrast, no gradients, no colors
- Strong black silhouette with white highlights for muscle definition
- Clean white background
- The athlete wears a hoodie and athletic pants
- "OC" logo visible on the back of the hoodie when the character's back is shown
- Powerful, clean athletic posture
- Streetwear calisthenics aesthetic

Your task: given an exercise name, description, muscle groups, category, and equipment,
write a precise image generation prompt that describes the exact body position and movement.

Rules:
- Be specific about body position (e.g., "arms fully extended overhead", "legs parallel to ground")
- Specify the camera angle (side view, front view, rear view, 3/4 view)
- Mention any equipment involved (pull-up bar, parallel bars, rings, etc.)
- Keep the style description consistent with the reference image
- Output ONLY the prompt text, no explanations`;

async function generateImagePrompt(client: OpenAI, exercise: Exercise): Promise<string> {
	const muscleGroups = exercise.muscle_group.join(', ');
	const equipment = exercise.equipment.join(', ');

	const userMessage = `Generate an image prompt for this calisthenics exercise:

Name: ${exercise.name}
Description: ${exercise.description}
Category: ${exercise.category}
Type: ${exercise.type} (${exercise.type === 'isometric' ? 'held position' : 'movement'})
Muscle groups: ${muscleGroups}
Equipment: ${equipment}
Difficulty: ${exercise.difficulty}/5

Write the image generation prompt:`;

	const response = await client.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{ role: 'system', content: SYSTEM_PROMPT },
			{ role: 'user', content: userMessage },
		],
		max_tokens: 300,
		temperature: 0.7,
	});

	return response.choices[0].message.content?.trim() ?? '';
}

// ─── Generación de imagen ─────────────────────────────────────────────────────

async function generateImage(client: OpenAI, prompt: string): Promise<Buffer> {
	const referenceImageBuffer = fs.readFileSync(REFERENCE_IMAGE_PATH);

	// gpt-image-1 con imagen de referencia para mantener el estilo
	const response = await client.images.edit({
		model: 'gpt-image-1',
		image: new File([referenceImageBuffer], 'reference_image.png', { type: 'image/png' }),
		prompt,
		n: 1,
		size: '1024x1024',
	});

	const b64 = response.data[0].b64_json;
	if (!b64) throw new Error('No image data returned from API');

	return Buffer.from(b64, 'base64');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
	const args = parseArgs();

	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		console.error('Error: OPENAI_API_KEY no está configurada');
		process.exit(1);
	}

	const client = new OpenAI({ apiKey });

	// Crear directorio de salida
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
		console.log(`Directorio creado: ${OUTPUT_DIR}`);
	}

	// Cargar ejercicios
	let exercises = loadExercises();
	if (args.ids) {
		exercises = exercises.filter((e) => args.ids!.includes(e.id));
		console.log(`Filtrando a ${exercises.length} ejercicio(s): IDs ${args.ids.join(', ')}`);
	}
	if (args.limit !== null) {
		exercises = exercises.slice(0, args.limit);
		console.log(`Limitando a ${exercises.length} ejercicio(s)`);
	}

	console.log(`\nModo: ${args.dryRun ? 'DRY RUN (solo prompts)' : 'GENERACIÓN REAL'}`);
	console.log(`Total ejercicios: ${exercises.length}`);
	console.log(`Skip existentes: ${args.skipExisting ? 'sí' : 'no'}`);
	console.log('─'.repeat(60));

	let generated = 0;
	let skipped = 0;
	let failed = 0;

	for (const exercise of exercises) {
		const outputPath = path.join(OUTPUT_DIR, `${exercise.id}.png`);
		const relativePath = `/images/exercises/${exercise.id}.png`;

		// Saltar si ya existe
		if (args.skipExisting && fs.existsSync(outputPath)) {
			console.log(`[${exercise.id}] ⏭  ${exercise.name} — ya existe`);
			skipped++;
			continue;
		}

		console.log(`\n[${exercise.id}] Procesando: ${exercise.name}`);
		console.log(`  Categoría: ${exercise.category} | Músculos: ${exercise.muscle_group.join(', ')}`);

		try {
			// Paso 1: LLM genera el prompt
			console.log(`  → Generando prompt con gpt-4o...`);
			const imagePrompt = await generateImagePrompt(client, exercise);
			console.log(`  Prompt: "${imagePrompt.slice(0, 120)}..."`);

			if (args.dryRun) {
				console.log(`  [DRY RUN] Imagen NO generada. Ruta sería: ${relativePath}`);
				generated++;
				continue;
			}

			// Paso 2: gpt-image-1 genera la imagen
			console.log(`  → Generando imagen con gpt-image-1...`);
			const imageBuffer = await generateImage(client, imagePrompt);

			// Paso 3: Guardar imagen
			fs.writeFileSync(outputPath, imageBuffer);
			console.log(`  ✓ Guardada en: ${relativePath}`);
			generated++;

			// Delay entre requests para evitar rate limiting
			if (exercises.indexOf(exercise) < exercises.length - 1) {
				await sleep(DELAY_BETWEEN_REQUESTS_MS);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			console.error(`  ✗ Error en ejercicio ${exercise.id}: ${message}`);
			failed++;
		}
	}

	// ─── Resumen ───────────────────────────────────────────────────────────────
	console.log('\n' + '─'.repeat(60));
	console.log('Resumen:');
	console.log(`  ✓ ${args.dryRun ? 'Prompts generados' : 'Imágenes generadas'}: ${generated}`);
	console.log(`  ⏭  Saltados: ${skipped}`);
	console.log(`  ✗ Fallidos: ${failed}`);

	if (!args.dryRun && generated > 0) {
		console.log(`\nImágenes guardadas en: ${OUTPUT_DIR}`);
		console.log('Para actualizar exercises.json con las rutas locales, actualiza el campo "image"');
		console.log('a "/images/exercises/{id}.png" por cada ejercicio generado.');
	}
}

main().catch((err) => {
	console.error('Error fatal:', err);
	process.exit(1);
});

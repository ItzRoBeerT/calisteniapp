/**
 * Script para sincronizar los ejercicios del JSON local con Supabase
 *
 * Uso: npm run sync-exercises
 *
 * Este script:
 * 1. Lee los ejercicios base desde data/exercises.json
 * 2. Lee las traducciones desde messages/es.json (idioma por defecto)
 * 3. Combina los datos y los sube a Supabase usando upsert
 * 4. Reporta el resultado de la sincronizacion
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

interface ExerciseBase {
	id: number;
	image: string;
	muscle_group: string[];
	difficulty: number;
}

interface ExerciseTranslation {
	name: string;
	description: string;
}

interface Exercise extends ExerciseBase {
	name: string;
	description: string;
}

async function syncExercises() {
	// Verificar variables de entorno
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		console.error('Error: Variables de entorno de Supabase no configuradas');
		console.error('Necesitas definir:');
		console.error('  - NEXT_PUBLIC_SUPABASE_URL');
		console.error('  - SUPABASE_SERVICE_ROLE_KEY (recomendado) o NEXT_PUBLIC_SUPABASE_ANON_KEY');
		process.exit(1);
	}

	// Leer archivos
	const exercisesPath = path.join(__dirname, '../data/exercises.json');
	const messagesEsPath = path.join(__dirname, '../messages/es.json');

	const exercisesBase: ExerciseBase[] = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));
	const messagesEs = JSON.parse(fs.readFileSync(messagesEsPath, 'utf-8'));
	const translations: Record<string, ExerciseTranslation> = messagesEs.Exercises;

	// Combinar datos base con traducciones
	const exercises: Exercise[] = exercisesBase.map((base) => {
		const translation = translations[String(base.id)] || {
			name: `Exercise ${base.id}`,
			description: '',
		};
		return {
			...base,
			name: translation.name,
			description: translation.description,
		};
	});

	console.log(`\nSincronizando ${exercises.length} ejercicios con Supabase...\n`);

	const supabase = createClient(supabaseUrl, supabaseKey);

	// Usar upsert para insertar o actualizar
	const { data, error } = await supabase
		.from('Exercise')
		.upsert(exercises, {
			onConflict: 'id',
			ignoreDuplicates: false
		})
		.select();

	if (error) {
		console.error('Error al sincronizar ejercicios:', error.message);
		process.exit(1);
	}

	console.log(`Sincronizacion completada exitosamente!`);
	console.log(`Total de ejercicios sincronizados: ${data?.length || exercises.length}`);

	// Mostrar resumen por dificultad
	const byDifficulty: Record<number, number> = {};
	exercises.forEach(e => {
		byDifficulty[e.difficulty] = (byDifficulty[e.difficulty] || 0) + 1;
	});

	console.log('\nResumen por dificultad:');
	const difficultyLabels = ['Muy facil', 'Facil', 'Intermedio', 'Dificil', 'Muy dificil', 'Experto'];
	Object.entries(byDifficulty)
		.sort(([a], [b]) => Number(a) - Number(b))
		.forEach(([diff, count]) => {
			console.log(`  ${difficultyLabels[Number(diff)]}: ${count} ejercicios`);
		});

	// Mostrar resumen por grupo muscular
	const byMuscle: Record<string, number> = {};
	exercises.forEach(e => {
		e.muscle_group.forEach(mg => {
			byMuscle[mg] = (byMuscle[mg] || 0) + 1;
		});
	});

	console.log('\nResumen por grupo muscular:');
	Object.entries(byMuscle)
		.sort(([, a], [, b]) => b - a)
		.forEach(([muscle, count]) => {
			console.log(`  ${muscle}: ${count} ejercicios`);
		});
}

syncExercises().catch(console.error);

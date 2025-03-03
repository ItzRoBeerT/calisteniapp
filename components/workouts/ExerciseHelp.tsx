'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatTime } from '@/utils/formatters';
import { createSlug } from '@/utils/slugs';
import Image from 'next/image';
import DefaultImage from '@/public/images/default_image.webp';

export default function ExerciseHelp({ exercise, index }) {
	const [isOpen, setIsOpen] = useState(false);
	const [exerciseDetails, setExerciseDetails] = useState(null);
	const [loading, setLoading] = useState(false);

	const toggleHelp = async () => {
		if (!isOpen && !exerciseDetails) {
			setLoading(true);
			try {
				const response = await fetch(`/api/exercises/${exercise.id}`);
				if (response.ok) {
					const data = await response.json();
					setExerciseDetails(data);
				}
			} catch (error) {
				console.error('Error fetching exercise details:', error);
			} finally {
				setLoading(false);
			}
		}
		setIsOpen(!isOpen);
	};

	// Color alternativo para filas
	const rowBgClass = index % 2 === 0 ? 'bg-surface' : 'bg-surface-dark';

	return (
		<div className="flex flex-col">
			{/* Fila principal del ejercicio */}
			<div className={`${rowBgClass} p-4 md:p-6`}>
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-bold">
								{index + 1}
							</div>
							<h3 className="text-lg font-semibold">
								{exercise.name}
							</h3>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-4 md:gap-6">
						<div className="flex flex-col items-center">
							<span className="text-sm text-gray-400">
								Series
							</span>
							<span className="font-bold">{exercise.sets}</span>
						</div>

						<div className="flex flex-col items-center">
							<span className="text-sm text-gray-400">Reps</span>
							<span className="font-bold">{exercise.reps}</span>
						</div>

						<div className="flex flex-col items-center">
							<span className="text-sm text-gray-400">
								Descanso
							</span>
							<span className="font-bold">
								{formatTime(exercise.rest)}
							</span>
						</div>

						<button
							onClick={toggleHelp}
							className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
								isOpen
									? 'bg-primary-600 text-white'
									: 'bg-gray-700 hover:bg-gray-600 text-white'
							}`}
						>
							{isOpen ? 'Ocultar' : 'Ayuda'}
						</button>
					</div>
				</div>
			</div>

			{/* Panel desplegable con la ayuda */}
			{isOpen && (
				<div className="border-t border-gray-700 bg-surface-dark p-4 md:p-6 transition-all">
					{loading ? (
						<div className="flex justify-center items-center p-8">
							<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
						</div>
					) : exerciseDetails ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="md:col-span-1">
								<Image
									src={exerciseDetails.image || DefaultImage}
									alt={exerciseDetails.name}
									width={300}
									height={300}
									className="w-full h-auto object-cover rounded-lg"
								/>
							</div>

							<div className="md:col-span-2">
								<h4 className="text-xl font-bold mb-3">
									{exerciseDetails.name}
								</h4>

								{exerciseDetails.description ? (
									<p className="mb-4">
										{exerciseDetails.description}
									</p>
								) : (
									<p className="mb-4 text-gray-400">
										No hay descripción disponible para este
										ejercicio.
									</p>
								)}

								{exerciseDetails.muscle_groups && (
									<div className="mb-4">
										<h5 className="font-semibold text-sm text-gray-300 mb-2">
											Grupos musculares
										</h5>
										<div className="flex flex-wrap gap-2">
											{exerciseDetails.muscle_groups.map(
												(muscle, i) => (
													<span
														key={i}
														className="px-2 py-1 bg-primary-800 rounded-md text-sm"
													>
														{muscle}
													</span>
												)
											)}
										</div>
									</div>
								)}

								<Link
									href={`/exercises/${createSlug(
										exerciseDetails.name
									)}`}
									className="inline-block mt-2 bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg transition-colors"
								>
									Ver detalles completos
								</Link>
							</div>
						</div>
					) : (
						<div className="text-center p-4">
							<p>
								No se pudo cargar la información del ejercicio.
							</p>
							<Link
								href={`/exercises/${exercise.id}`}
								className="inline-block mt-3 text-primary-400 hover:text-primary-300 underline"
							>
								Ver página del ejercicio
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

'use client';
import React from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	LabelList,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;
		return (
			<div className="bg-surface p-3 border border-gray-700 rounded shadow-lg">
				<p className="font-semibold">{data.name}</p>
				<p className="text-gray-300 text-sm">
					{data.sets} series × {data.reps} reps
				</p>
				<p className="text-primary-300 font-medium">
					Volumen total: {data.volume}
				</p>
			</div>
		);
	}
	return null;
};

export default function WorkoutStatsClient({ exerciseData }) {
	// Verificar si exerciseData es un array y tiene elementos
	if (
		!exerciseData ||
		!Array.isArray(exerciseData) ||
		exerciseData.length === 0
	) {
		return (
			<div className="flex items-center justify-center h-64 bg-surface-dark rounded-lg">
				<p className="text-gray-400">
					No hay datos disponibles para mostrar estadísticas
				</p>
			</div>
		);
	}

	// Limitamos a los 5 ejercicios con mayor volumen para mejor visualización
	const sortedData = [...exerciseData]
		.filter((ex) => ex && typeof ex === 'object')
		.sort((a, b) => (b.volume || 0) - (a.volume || 0))
		.slice(0, 5)
		.map((exercise) => ({
			name: exercise.name || 'Sin nombre',
			sets: exercise.sets || 0,
			reps: exercise.reps || 0,
			volume: exercise.volume || 0,
			// Acortamos nombres largos para mejor visualización
			displayName:
				(exercise.name || 'Sin nombre').length > 12
					? (exercise.name || 'Sin nombre').substring(0, 10) + '...'
					: exercise.name || 'Sin nombre',
		}));

	// Si después de filtrar no quedan datos, mostrar mensaje
	if (sortedData.length === 0) {
		return (
			<div className="flex items-center justify-center h-64 bg-surface-dark rounded-lg">
				<p className="text-gray-400">
					No hay datos suficientes para mostrar estadísticas
				</p>
			</div>
		);
	}

	const maxVolume = Math.max(...sortedData.map((d) => d.volume)) || 100;

	return (
		<div className="h-64 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={sortedData}
					margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
				>
					<XAxis
						dataKey="displayName"
						tick={{ fill: '#a0aec0', fontSize: 12 }}
						tickLine={{ stroke: '#4a5568' }}
						axisLine={{ stroke: '#4a5568' }}
					/>
					<YAxis
						hide={true}
						domain={[0, maxVolume * 1.1]} // 10% de espacio extra arriba
					/>
					<Tooltip content={<CustomTooltip />} />
					<Bar
						dataKey="volume"
						fill="#4C51BF"
						radius={[4, 4, 0, 0]}
						maxBarSize={50}
					>
						<LabelList
							dataKey="volume"
							position="top"
							fill="#a0aec0"
							fontSize={12}
							formatter={(value) => value}
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

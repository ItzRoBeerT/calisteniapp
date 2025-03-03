'use client';
import { Filter } from '@/types/supabase';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ExerciseFilter(props: { allFilters: Filter }) {
	const { allFilters } = props;

	const [selectedFilters, setSelectedFilters] = useState<Filter>({
		difficulties: [],
		muscleGroups: [],
		families: [],
	});
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	//#region FUNCTIONS

	useEffect(() => {
		// actualizar selectedFilters con los valores actuales de la URL
		if (searchParams.has('difficulties')) {
			setSelectedFilters((prev) => ({
				...prev,
				difficulties: [searchParams.get('difficulties') as string],
			}));
		}

		if (searchParams.has('muscle_groups')) {
			setSelectedFilters((prev) => ({
				...prev,
				muscleGroups: [searchParams.get('muscle_groups') as string],
			}));
		}
	}, []);

	const onFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		// Actualiza el estado de los filtros seleccionados
		setSelectedFilters((prev) => ({ ...prev, [name]: [value] }));

		const newSearchParams = new URLSearchParams(searchParams.toString());
		newSearchParams.set(name, value);

		if (value === '') {
			newSearchParams.delete(name);
		}

		const newUrl = `${pathname}?${newSearchParams.toString()}`;
		router.push(newUrl);
	};
	//#endregion
	
	return (
		<div className="bg-surface w-fit p-4 flex gap-4 rounded-xl">
			<select
				className="text-black rounded"
				name="difficulties"
				onChange={onFilterChange}
			>
				<option value="">Dificultad</option>
				{allFilters.difficulties.map((item, index) => (
					<option key={index} value={item}>
						{item}
					</option>
				))}
			</select>

			<select
				className="text-black rounded"
				name="muscle_groups"
				onChange={onFilterChange}

				value={selectedFilters.muscleGroups[0]}
			>
				<option value="">Grupo muscular</option>
				{allFilters.muscleGroups.map((item, index) => (
					<option key={index} value={item}>
						{item}
					</option>
				))}
			</select>
		</div>
	);
}

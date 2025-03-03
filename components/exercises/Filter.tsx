'use client';
import { Filter } from '@/types/supabase';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ExerciseFilter(props: { allFilters: Filter }) {
	const { allFilters } = props;
	const [selectedFilters, setSelectedFilters] = useState<Filter>({
		difficulty: [],
		muscle_group: [],
	});
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	//#region FUNCTIONS

	useEffect(() => {
		// actualizar selectedFilters con los valores actuales de la URL
		if (searchParams.has('difficulty')) {
			setSelectedFilters((prev) => ({
				...prev,
				difficulty: [searchParams.get('difficulty') as string],
			}));
		}

		if (searchParams.has('muscle_group')) {
			setSelectedFilters((prev) => ({
				...prev,
				muscle_group: [searchParams.get('muscle_group') as string],
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

	console.log({selectedFilters});
	


	//#endregion

	return (
		<div className="bg-surface w-fit p-4 flex gap-4 rounded-xl">
			<select
				className="text-black rounded"
				name="difficulty"
				onChange={onFilterChange}
				value={selectedFilters.difficulty[0]}
			>
				<option value="">Dificultad</option>
				<option value="beginner">Principiante</option>
				<option value="intermediate">Intermedio</option>
				<option value="advanced">Avanzado </option>
			</select>
			

			<select
				className="text-black rounded"
				name="muscle_group"
				onChange={onFilterChange}
				value={selectedFilters.muscle_group[0]}
			>
				<option value="">Grupo muscular</option>
				{allFilters.muscle_group.map((item, index) => (
					<option key={index} value={item}>
						{item}
					</option>
				))}
			</select>
		</div>
	);
}

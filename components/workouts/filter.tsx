'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TagInput from '@/components/workouts/TagInput';

export type WorkoutFilters = {
	difficulties: string[];
	durations: string[];
	tags: string[];
};

type WorkoutFilterProps = {
	allFilters: WorkoutFilters;
};

export default function WorkoutFilter({ allFilters }: WorkoutFilterProps) {
	const [filters, setFilters] = useState<WorkoutFilters>(allFilters);
	const [selectedFilters, setSelectedFilters] = useState<WorkoutFilters>({
		difficulties: [],
		durations: [],
		tags: [],
	});
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Update selectedFilters with current URL values
		if (searchParams.has('difficulty')) {
			setSelectedFilters((prev) => ({
				...prev,
				difficulties: [searchParams.get('difficulty') as string],
			}));
		}

		if (searchParams.has('duration')) {
			setSelectedFilters((prev) => ({
				...prev,
				durations: [searchParams.get('duration') as string],
			}));
		}

		if (searchParams.has('tags')) {
			const tagsParam = searchParams.get('tags');
			if (tagsParam) {
				const tags = tagsParam.split(',');
				setSelectedTags(tags);
				setSelectedFilters((prev) => ({
					...prev,
					tags: tags,
				}));
				console.log('Tags loaded from URL:', tags);
			}
		}
	}, [searchParams]);

	const onFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;

		// Update selected filters state
		setSelectedFilters((prev) => ({
			...prev,
			[name]: value ? [value] : [],
		}));

		// Update URL params
		const newSearchParams = new URLSearchParams(searchParams.toString());

		if (value === '') {
			newSearchParams.delete(name);
		} else {
			newSearchParams.set(name, value);
		}

		const newUrl = `${pathname}?${newSearchParams.toString()}`;
		router.push(newUrl);
	};

	const handleAddTag = (tag: string) => {
		if (!selectedTags.includes(tag)) {
			const newTags = [...selectedTags, tag];
			setSelectedTags(newTags);

			// Update URL params with new tags
			const newSearchParams = new URLSearchParams(
				searchParams.toString()
			);
			newSearchParams.set('tags', newTags.join(','));

			const newUrl = `${pathname}?${newSearchParams.toString()}`;
			router.push(newUrl);

			return true;
		}
		return false;
	};

	const handleRemoveTag = (tag: string) => {
		const newTags = selectedTags.filter((t) => t !== tag);
		setSelectedTags(newTags);

		// Update URL params with new tags
		const newSearchParams = new URLSearchParams(searchParams.toString());

		if (newTags.length === 0) {
			newSearchParams.delete('tags');
		} else {
			newSearchParams.set('tags', newTags.join(','));
		}

		const newUrl = `${pathname}?${newSearchParams.toString()}`;
		router.push(newUrl);
	};

	return (
		<div className="bg-surface w-full p-4 flex flex-col md:flex-row gap-4 rounded-xl">
			<select
				className="text-black rounded p-2"
				name="difficulty"
				onChange={onFilterChange}
				value={selectedFilters.difficulties[0] || ''}
			>
				<option value="">Dificultad</option>
				{filters.difficulties.map((item, index) => (
					<option key={index} value={item}>
						{item}
					</option>
				))}
			</select>

			<select
				className="text-black rounded p-2"
				name="duration"
				onChange={onFilterChange}
				value={selectedFilters.durations[0] || ''}
			>
				<option value="">Duración</option>
				{filters.durations.map((item, index) => (
					<option key={index} value={item}>
						{item}
					</option>
				))}
			</select>

			<div className="flex-grow">
				<TagInput
					tags={selectedTags}
					suggestions={filters.tags}
					onAddTag={handleAddTag}
					onRemoveTag={handleRemoveTag}
				/>
			</div>
		</div>
	);
}

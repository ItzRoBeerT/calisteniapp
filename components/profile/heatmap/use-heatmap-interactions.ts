import { useState, useCallback, useRef, useEffect } from 'react';
import { CELL_GAP, DAY_LABELS_WIDTH } from './utils';
import type { DayData } from './types';

type Tooltip = {
	x: number;
	y: number;
	day: DayData;
} | null;

export function useHeatmapInteractions(weeksLength: number) {
	const [selectedDay, setSelectedDay] = useState<string | null>(null);
	const [tooltip, setTooltip] = useState<Tooltip>(null);
	const [cellSize, setCellSize] = useState(11);
	const containerRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const activityRef = useRef<HTMLDivElement>(null);

	const handleCellHover = useCallback(
		(e: React.MouseEvent, day: DayData) => {
			if (!containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const cellRect = (e.target as HTMLElement).getBoundingClientRect();
			const flipped = day.row <= 1;
			setTooltip({
				x: cellRect.left - rect.left + cellRect.width / 2,
				y: flipped
					? cellRect.bottom - rect.top + 8
					: cellRect.top - rect.top - 8,
				day,
			});
		},
		[]
	);

	const handleCellClick = useCallback((day: DayData) => {
		setSelectedDay((prev) => (prev === day.key ? null : day.key));
	}, []);

	const handleCellLeave = useCallback(() => {
		setTooltip(null);
	}, []);

	const clearSelectedDay = useCallback(() => {
		setSelectedDay(null);
	}, []);

	useEffect(() => {
		const handleScroll = () => setTooltip(null);
		window.addEventListener('scroll', handleScroll, true);
		return () => window.removeEventListener('scroll', handleScroll, true);
	}, []);

	useEffect(() => {
		if (selectedDay && activityRef.current) {
			activityRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [selectedDay]);

	useEffect(() => {
		const el = gridRef.current;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			const width = entries[0].contentRect.width;
			if (weeksLength === 0) return;
			const available = width - DAY_LABELS_WIDTH - 4;
			const size = Math.floor((available - (weeksLength - 1) * CELL_GAP) / weeksLength);
			setCellSize(Math.max(size, 2));
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, [weeksLength]);

	return {
		selectedDay,
		setSelectedDay,
		clearSelectedDay,
		tooltip,
		cellSize,
		containerRef,
		gridRef,
		activityRef,
		handleCellHover,
		handleCellClick,
		handleCellLeave,
	};
}

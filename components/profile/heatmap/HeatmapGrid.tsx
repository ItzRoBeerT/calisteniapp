'use client';

import { useTranslations } from 'next-intl';
import { CELL_GAP, DAY_LABELS_WIDTH, INTENSITY_COLORS, getIntensityLevel } from './utils';
import HeatmapTooltip from './HeatmapTooltip';
import type { DayData, MonthLabel } from './types';

type HeatmapGridProps = {
	weeks: DayData[][];
	monthLabels: MonthLabel[];
	maxCount: number;
	totalCount: number;
	currentStreak: number;
	selectedYear: number | null;
	selectedDay: string | null;
	cellSize: number;
	tooltip: { x: number; y: number; day: DayData } | null;
	containerRef: React.Ref<HTMLDivElement>;
	gridRef: React.Ref<HTMLDivElement>;
	onCellHover: (e: React.MouseEvent, day: DayData) => void;
	onCellLeave: () => void;
	onCellClick: (day: DayData) => void;
	onYearChange: (year: number | null) => void;
	availableYears: number[];
};

export default function HeatmapGrid({
	weeks,
	monthLabels,
	maxCount,
	totalCount,
	currentStreak,
	selectedYear,
	selectedDay,
	cellSize,
	tooltip,
	containerRef,
	gridRef,
	onCellHover,
	onCellLeave,
	onCellClick,
	onYearChange,
	availableYears,
}: HeatmapGridProps) {
	const t = useTranslations('Profile');
	const isRolling = selectedYear === null;
	const dayLabels = [t('dayMon'), t('dayWed'), t('dayFri')];

	return (
		<div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm">
			<div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent pointer-events-none" />

			{/* Section header */}
			<div className="relative px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
						<svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
					</div>
					<div>
						<h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground/80">
							{t('workoutActivityTitle')}
						</h2>
						<p className="text-xs text-foreground/40 mt-0.5">
							<strong className="text-foreground/70">{totalCount}</strong>{' '}
							{isRolling ? t('completionsLastYear') : t('completionsInYear', { year: selectedYear })}
							{currentStreak > 0 && isRolling && (
								<>
									{' · '}
									<strong className="text-foreground/70">{currentStreak}</strong> {t('dayStreak')}
								</>
							)}
						</p>
					</div>
				</div>

				{/* Year pills */}
				<div className="flex items-center gap-1">
					{availableYears.map((year) => (
						<button
							key={year}
							onClick={() => onYearChange(selectedYear === year ? null : year)}
							className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
								selectedYear === year
									? 'font-bold text-foreground bg-primary-500/15 border border-primary-500/20'
									: 'text-foreground/40 hover:text-foreground/70 hover:bg-white/[0.04] border border-transparent'
							}`}
						>
							{year}
						</button>
					))}
				</div>
			</div>

			{/* Heatmap grid */}
			<div className="relative p-4" ref={gridRef}>
				<div className="w-full relative" ref={containerRef}>
					{/* Month labels */}
					<div className="relative text-xs text-foreground/40 mb-1" style={{ paddingLeft: DAY_LABELS_WIDTH, height: 16 }}>
						{monthLabels.map((m) => (
							<span
								key={`${m.label}-${m.col}`}
								className="absolute"
								style={{ left: DAY_LABELS_WIDTH + m.col * (cellSize + CELL_GAP) }}
							>
								{m.label}
							</span>
						))}
					</div>

					{/* Grid with day labels */}
					<div className="flex">
						<div
							className="flex flex-col text-xs text-foreground/40 mr-1 shrink-0"
							style={{ width: DAY_LABELS_WIDTH - 4 }}
						>
							{[0, 1, 2, 3, 4, 5, 6].map((row) => (
								<div
									key={row}
									style={{ height: cellSize + CELL_GAP }}
									className="flex items-center justify-end pr-1"
								>
									{row === 1 ? dayLabels[0] : row === 3 ? dayLabels[1] : row === 5 ? dayLabels[2] : ''}
								</div>
							))}
						</div>

						<div className="flex gap-[2px] flex-1">
							{weeks.map((week, weekIdx) => (
								<div key={weekIdx} className="flex flex-col gap-[2px] flex-1">
									{Array.from({ length: 7 }).map((_, dayIdx) => {
										const day = week[dayIdx];
										const outOfRange = day && !isRolling && day.date.getFullYear() !== selectedYear;
										if (!day || outOfRange) {
											return (
												<div
													key={day?.key ?? dayIdx}
													style={{ height: cellSize }}
												/>
											);
										}
										const level = getIntensityLevel(day.count, maxCount);
										const isSelected = selectedDay === day.key;
										const isDimmed = selectedDay !== null && !isSelected;
										return (
											<div
												key={day.key}
												className={`rounded-sm cursor-pointer ${INTENSITY_COLORS[level]} ${isSelected ? 'ring-2 ring-primary-400' : 'hover:ring-1 hover:ring-foreground/30'} ${isDimmed ? 'opacity-30' : ''} transition-all`}
												style={{ height: cellSize }}
												onMouseEnter={(e) => onCellHover(e, day)}
												onMouseLeave={onCellLeave}
												onClick={() => onCellClick(day)}
											/>
										);
									})}
								</div>
							))}
						</div>
					</div>

					{/* Legend */}
					<div className="flex items-center justify-end gap-1 mt-2 text-xs text-foreground/40">
						<span>{t('less')}</span>
						{INTENSITY_COLORS.map((color, i) => (
							<div
								key={i}
								className={`rounded-sm ${color}`}
								style={{ width: cellSize - 2, height: cellSize - 2 }}
							/>
						))}
						<span>{t('more')}</span>
					</div>

					{/* Tooltip */}
					{tooltip && <HeatmapTooltip x={tooltip.x} y={tooltip.y} day={tooltip.day} />}
				</div>
			</div>
		</div>
	);
}

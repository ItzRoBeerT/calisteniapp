import { WorkoutDetail } from '@/types/Workout';
import { getDifficultyColor } from '@/utils/difficultyColors';

type WorkoutCardProps = {
	workout: WorkoutDetail;
	onSelect: (workout: WorkoutDetail) => void;
	variant?: 'default' | 'liked';
	dateLabel: string;
	formattedDate: string;
	exerciseLabel: string;
};

export default function WorkoutCard({
	workout,
	onSelect,
	variant = 'default',
	dateLabel,
	formattedDate,
	exerciseLabel,
}: WorkoutCardProps) {
	const isLiked = variant === 'liked';
	const hoverRingColor = isLiked ? 'hover:ring-red-500' : 'hover:ring-primary-500';
	const titleHoverColor = isLiked ? 'group-hover:text-red-400' : 'group-hover:text-primary-400';
	const likesColor = isLiked ? 'text-red-400' : 'text-foreground/60';

	return (
		<button
			onClick={() => onSelect(workout)}
			className={`bg-surface rounded-xl p-5 text-left hover:ring-2 ${hoverRingColor} transition-all group`}
		>
			<h3 className={`text-lg font-semibold text-foreground ${titleHoverColor} transition-colors mb-2 line-clamp-2`}>
				{workout.name}
			</h3>
			{workout.description && (
				<p className="text-foreground/60 text-sm mb-3 line-clamp-2">
					{workout.description}
				</p>
			)}
			<div className="flex flex-wrap gap-2 mb-3">
				{workout.difficulty && (
					<span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(workout.difficulty)}`}>
						{workout.difficulty}
					</span>
				)}
				{workout.duration && (
					<span className="px-2 py-1 text-xs bg-tertiary-500/20 text-tertiary-400 rounded-full border border-tertiary-500/30">
						{workout.duration} min
					</span>
				)}
				<span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
					{workout.exercises.length} {exerciseLabel}
				</span>
			</div>
			<div className="text-xs text-foreground/40 flex justify-between items-center pt-2 border-t border-white/10">
				<span>{formattedDate} - {dateLabel}</span>
				{workout.likes_count !== undefined && (
					<span className={`flex items-center gap-1 ${likesColor}`}>
						<svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
							<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
						</svg>
						{workout.likes_count}
					</span>
				)}
			</div>
		</button>
	);
}

export function getDayKey(date: Date): string {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

export function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date, locale: string): string {
	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const yyyy = date.getFullYear();
	return locale === 'es' ? `${dd}/${mm}/${yyyy}` : `${mm}/${dd}/${yyyy}`;
}

 
export function formatRelativeDate(dateStr: string, locale: string, t: (key: any, values?: any) => string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return t('today');
	if (diffDays === 1) return t('yesterday');
	if (diffDays < 7) return t('daysAgo', { count: diffDays });

	const monthKeys = [
		'monthJan', 'monthFeb', 'monthMar', 'monthApr', 'monthMay', 'monthJun',
		'monthJul', 'monthAug', 'monthSep', 'monthOct', 'monthNov', 'monthDec',
	] as const;

	const day = date.getDate();
	const month = t(monthKeys[date.getMonth()]);
	const year = date.getFullYear();

	if (year === now.getFullYear()) {
		return `${month} ${day}`;
	}
	return `${month} ${day}, ${year}`;
}

export function getIntensityLevel(count: number, max: number): number {
	if (count === 0) return 0;
	if (max <= 1) return 1;
	const ratio = count / max;
	if (ratio <= 0.25) return 1;
	if (ratio <= 0.5) return 2;
	if (ratio <= 0.75) return 3;
	return 4;
}

export const DEFAULT_CELL_SIZE = 11;
export const CELL_GAP = 2;
export const DAY_LABELS_WIDTH = 32;

export const INTENSITY_COLORS = [
	'bg-white/[0.06]',
	'bg-primary-900',
	'bg-primary-700',
	'bg-primary-500',
	'bg-primary-300',
];

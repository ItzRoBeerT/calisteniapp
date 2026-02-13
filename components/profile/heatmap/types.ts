export type Completion = {
	completed_at: string;
	workout_name: string;
	workout_id: number | null;
	duration_seconds: number | null;
	exercises_count: number | null;
};

export type DayData = {
	date: Date;
	key: string;
	count: number;
	completions: Completion[];
	row: number;
};

export type MonthLabel = {
	label: string;
	col: number;
};

export type MonthActivity = {
	monthLabel: string;
	year: number;
	days: Map<string, Completion[]>;
	sortedDays: [string, Completion[]][];
};

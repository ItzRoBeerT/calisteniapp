'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const MUSCLE_GROUPS = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'core', 'legs', 'glutes'];
const EQUIPMENT_OPTIONS = ['none', 'pull_up_bar', 'parallel_bars', 'rings', 'resistance_band', 'bench', 'wall'];
const CATEGORIES = ['push', 'pull', 'legs', 'core', 'full_body', 'skill'];
const TYPES = ['dynamic', 'isometric', 'plyometric'];

function TagCheckbox({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: (v: boolean) => void;
}) {
	return (
		<button
			type="button"
			onClick={() => onChange(!checked)}
			className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
				checked
					? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
					: 'bg-white/5 border-white/10 text-[#6B7280] hover:border-white/20'
			}`}
			style={{ fontFamily: 'Space Grotesk, sans-serif' }}
		>
			{label}
		</button>
	);
}

export default function RequestExerciseButton() {
	const t = useTranslations('ExercisesPage');
	const locale = useLocale();
	const [open, setOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [submitted, setSubmitted] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState('');

	// Form state
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [muscleGroup, setMuscleGroup] = useState<string[]>([]);
	const [category, setCategory] = useState('');
	const [type, setType] = useState('');
	const [difficulty, setDifficulty] = useState('');
	const [equipment, setEquipment] = useState<string[]>([]);

	const toggleArray = (arr: string[], val: string, set: (v: string[]) => void) => {
		set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		setSending(true);
		setError('');
		try {
			const res = await fetch('/api/exercises/requests', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					description,
					muscle_group: muscleGroup,
					category: category || null,
					type: type || null,
					difficulty: difficulty !== '' ? Number(difficulty) : null,
					equipment,
					locale,
				}),
			});
			if (!res.ok) throw new Error('error');
			setSubmitted(true);
		} catch {
			setError(t('requestModal.errorMessage'));
		} finally {
			setSending(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setTimeout(() => {
			setName('');
			setDescription('');
			setMuscleGroup([]);
			setCategory('');
			setType('');
			setDifficulty('');
			setEquipment([]);
			setSubmitted(false);
			setError('');
		}, 300);
	};

	const inputClass =
		'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[#374151] focus:outline-none focus:border-primary-500/50 focus:bg-primary-500/5 transition-colors';
	const labelClass = 'block text-xs font-semibold text-[#555555] uppercase tracking-widest mb-1.5';

	return (
		<>
			<button
				onClick={async () => {
					const supabase = createClient();
					const { data: { user } } = await supabase!.auth.getUser();
					setIsAuthenticated(!!user);
					setOpen(true);
				}}
				className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-[#6B7280] hover:text-primary-600 hover:border-primary-600/20 transition-colors duration-200 shrink-0"
				style={{ fontFamily: 'Space Grotesk, sans-serif' }}
			>
				<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
				</svg>
				{t('requestButton')}
			</button>

			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
					<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

					<div
						className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
							<button
								onClick={handleClose}
								className="absolute top-4 right-4 text-[#374151] hover:text-[#6B7280] transition-colors"
							>
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
							<h3 className="text-xl font-bold text-white pr-8" style={{ fontFamily: 'Orbitron, sans-serif' }}>
								{t('requestModal.title')}
							</h3>
							<p className="text-xs text-[#555555] mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
								{t('requestModal.subtitle')}
							</p>
						</div>

						{!isAuthenticated ? (
							<div className="text-center py-10 px-6">
								<div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
									<svg className="w-6 h-6 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
								<h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
									{t('requestModal.authRequired')}
								</h3>
								<p className="text-sm text-[#6B7280] mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
									{t('requestModal.authMessage')}
								</p>
								<Link
									href={`/${locale}/login`}
									onClick={handleClose}
									className="inline-block px-6 py-2.5 rounded-xl bg-primary-500/20 border border-primary-500/50 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors"
									style={{ fontFamily: 'Space Grotesk, sans-serif' }}
								>
									{t('requestModal.goToLogin')}
								</Link>
							</div>
						) : submitted ? (
							<div className="text-center py-10 px-6">
								<div className="w-12 h-12 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-4">
									<svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
									{t('requestModal.successTitle')}
								</h3>
								<p className="text-sm text-[#6B7280] mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
									{t('requestModal.successMessage')}
								</p>
								<button
									onClick={handleClose}
									className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[#6B7280] hover:text-white hover:border-white/20 transition-colors"
									style={{ fontFamily: 'Space Grotesk, sans-serif' }}
								>
									{t('requestModal.close')}
								</button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
							<div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
								{/* Context note */}
								<div className="flex gap-2 p-3 rounded-lg bg-primary-500/5 border border-primary-500/10">
									<svg className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
										{t('requestModal.contextNote')}
									</p>
								</div>

								{/* Name */}
								<div>
									<label className={labelClass} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
										{t('requestModal.nameLabel')} <span className="text-primary-500">*</span>
									</label>
									<input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder={t('requestModal.namePlaceholder')}
										required
										className={inputClass}
										style={{ fontFamily: 'Space Grotesk, sans-serif' }}
									/>
								</div>

								{/* Description */}
								<div>
									<label className={labelClass} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
										{t('requestModal.descriptionLabel')}
									</label>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder={t('requestModal.descriptionPlaceholder')}
										rows={2}
										className={`${inputClass} resize-none`}
										style={{ fontFamily: 'Space Grotesk, sans-serif' }}
									/>
								</div>

								{/* Category + Type */}
								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className={labelClass} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
											{t('requestModal.categoryLabel')}
										</label>
										<select
											value={category}
											onChange={(e) => setCategory(e.target.value)}
											className={`${inputClass} appearance-none`}
											style={{ fontFamily: 'Space Grotesk, sans-serif' }}
										>
											<option value="">{t('requestModal.selectPlaceholder')}</option>
											{CATEGORIES.map((c) => (
												<option key={c} value={c}>{t(`requestModal.categories.${c}`)}</option>
											))}
										</select>
									</div>
									<div>
										<label className={labelClass} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
											{t('requestModal.typeLabel')}
										</label>
										<select
											value={type}
											onChange={(e) => setType(e.target.value)}
											className={`${inputClass} appearance-none`}
											style={{ fontFamily: 'Space Grotesk, sans-serif' }}
										>
											<option value="">{t('requestModal.selectPlaceholder')}</option>
											{TYPES.map((tp) => (
												<option key={tp} value={tp}>{t(`requestModal.types.${tp}`)}</option>
											))}
										</select>
									</div>
								</div>

								{/* Difficulty */}
								<div>
									<label className={labelClass} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
										{t('requestModal.difficultyLabel')}
									</label>
									<select
										value={difficulty}
										onChange={(e) => setDifficulty(e.target.value)}
										className={`${inputClass} appearance-none`}
										style={{ fontFamily: 'Space Grotesk, sans-serif' }}
									>
										<option value="">{t('requestModal.selectPlaceholder')}</option>
										{[1, 2, 3, 4, 5].map((d) => (
											<option key={d} value={d}>{t(`requestModal.difficulties.${d}`)}</option>
										))}
									</select>
								</div>

								{/* Muscle groups */}
								<div>
									<label className={labelClass} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
										{t('requestModal.muscleGroupLabel')}
									</label>
									<div className="flex flex-wrap gap-2">
										{MUSCLE_GROUPS.map((mg) => (
											<TagCheckbox
												key={mg}
												label={t(`requestModal.muscleGroups.${mg}`)}
												checked={muscleGroup.includes(mg)}
												onChange={() => toggleArray(muscleGroup, mg, setMuscleGroup)}
											/>
										))}
									</div>
								</div>

								{/* Equipment */}
								<div>
									<label className={labelClass} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
										{t('requestModal.equipmentLabel')}
									</label>
									<div className="flex flex-wrap gap-2">
										{EQUIPMENT_OPTIONS.map((eq) => (
											<TagCheckbox
												key={eq}
												label={t(`requestModal.equipment.${eq}`)}
												checked={equipment.includes(eq)}
												onChange={() => toggleArray(equipment, eq, setEquipment)}
											/>
										))}
									</div>
								</div>

							</div>

							{/* Footer fijo */}
							<div className="px-6 py-4 border-t border-white/5 shrink-0 space-y-3">
								{error && (
									<p className="text-xs text-red-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
										{error}
									</p>
								)}
								<button
									type="submit"
									disabled={sending || !name.trim()}
									className="w-full py-2.5 rounded-xl bg-primary-500/20 border border-primary-500/50 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
									style={{ fontFamily: 'Space Grotesk, sans-serif' }}
								>
									{sending ? t('requestModal.sending') : t('requestModal.submit')}
								</button>
							</div>
						</form>
						)}
					</div>
				</div>
			)}
		</>
	);
}

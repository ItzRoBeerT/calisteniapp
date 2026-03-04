'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { WorkoutDetail } from '@/types/Workout';
import { useToastStore } from '@/stores/toast';
import { generateWorkoutHTML, printHTML } from './workout-pdf';

type Props = {
  workout: WorkoutDetail;
};

export default function WorkoutExportButton({ workout }: Props) {
  const t = useTranslations('WorkoutDetail');
  const locale = useLocale();
  const addToast = useToastStore((s) => s.addToast);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      return;
    }
    addToast(t('linkCopied'), 'success');
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    const html = generateWorkoutHTML(workout, locale, {
      sets: t('sets'),
      reps: t('reps'),
      rest: t('rest'),
      exercises: t('exercises'),
      noExercises: t('noExercises'),
    });
    printHTML(html);
  };

  return (
    <>
      <button
        onClick={handleShareLink}
        className={`transition-colors ${copied ? 'text-green-400' : 'text-foreground/60 hover:text-foreground'}`}
        aria-label={t('shareLink')}
        title={t('shareLink')}
      >
        {copied ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )}
      </button>
      <button
        onClick={handleExportPDF}
        className="text-foreground/60 hover:text-foreground transition-colors"
        aria-label={t('exportPDF')}
        title={t('exportPDF')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    </>
  );
}

'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { WorkoutDetail } from '@/types/Workout';
import { useToastStore } from '@/stores/toast';

type Props = {
  workout: WorkoutDetail;
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export default function WorkoutExportButton({ workout }: Props) {
  const t = useTranslations('WorkoutDetail');
  const locale = useLocale();
  const addToast = useToastStore((s) => s.addToast);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const username = workout.username ?? null;

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
    const exercisesHTML = workout.exercises?.map((ex) => `
      <div class="exercise">
        <div class="exercise-name">${esc(ex.name)}</div>
        <div class="exercise-stats">
          <span class="badge badge-series">${ex.sets} ${esc(t('sets'))}</span>
          <span class="badge badge-reps">${ex.reps} ${esc(t('reps'))}</span>
          ${ex.rest ? `<span class="badge badge-rest">${ex.rest}s ${esc(t('rest'))}</span>` : ''}
        </div>
      </div>
    `).join('') ?? '';

    const tagsHTML = workout.tags?.length
      ? workout.tags.map((tag) => `<span class="tag">#${esc(tag)}</span>`).join('')
      : '';

    const workoutDate = new Date(workout.updated_at ?? workout.created_at ?? Date.now()).toLocaleDateString(locale);

    const html = `<!DOCTYPE html>
<html lang="${esc(locale)}">
<head>
  <meta charset="UTF-8" />
  <title>${esc(workout.name)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #fff;
      color: #1a1a2e;
      padding: 40px 48px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
    .header-left { flex: 1; }
    .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    h1 { font-size: 28px; font-weight: 700; }
    .header-pills { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; justify-content: flex-end; }
    .username { color: #888; font-size: 14px; margin-top: 4px; }
    .description { color: #555; font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
    .meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
    .pill {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid;
    }
    .pill-difficulty { background: #fef3c7; color: #92400e; border-color: #fcd34d; }
    .pill-duration { background: #ede9fe; color: #5b21b6; border-color: #c4b5fd; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
    .tag { font-size: 12px; color: #6366f1; background: #eef2ff; border-radius: 20px; padding: 2px 10px; }
    h2 { font-size: 18px; font-weight: 600; margin-bottom: 12px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; }
    .exercise {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-left: 4px solid #6366f1;
      background: #f9fafb;
      border-radius: 0 8px 8px 0;
      margin-bottom: 10px;
    }
    .exercise-name { font-weight: 600; font-size: 15px; }
    .exercise-stats { display: flex; gap: 6px; flex-wrap: wrap; }
    .badge {
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid;
    }
    .badge-series { background: #eef2ff; color: #4338ca; border-color: #c7d2fe; }
    .badge-reps { background: #fdf4ff; color: #7e22ce; border-color: #e9d5ff; }
    .badge-rest { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
    .footer { margin-top: 40px; font-size: 11px; color: #aaa; text-align: center; }
    @media print {
      @page { margin: 0; }
      body { padding: 1.5cm 2cm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>${esc(workout.name)}</h1>
      ${username ? `<p class="username">@${esc(username)}</p>` : ''}
    </div>
    <div class="header-right">
      <div class="header-pills">
        ${workout.difficulty ? `<span class="pill pill-difficulty">${esc(workout.difficulty)}</span>` : ''}
        ${workout.duration ? `<span class="pill pill-duration">${workout.duration} min</span>` : ''}
      </div>
      ${tagsHTML ? `<div class="tags">${tagsHTML}</div>` : ''}
    </div>
  </div>
  ${workout.description ? `<p class="description">${esc(workout.description)}</p>` : ''}
  <h2>${esc(t('exercises'))}</h2>
  ${exercisesHTML || `<p style="color:#aaa;font-size:13px">${esc(t('noExercises'))}</p>`}
  <div class="footer">${username ? `@${esc(username)} &mdash; ` : ''}OpenCalisthenic &mdash; ${workoutDate}</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;border:0;';
    document.body.appendChild(iframe);

    iframe.onload = () => {
      const cw = iframe.contentWindow;
      if (!cw) {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
        return;
      }

      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      };

      cw.addEventListener('afterprint', cleanup);
      setTimeout(cleanup, 10_000);
      cw.print();
    };

    iframe.src = url;
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

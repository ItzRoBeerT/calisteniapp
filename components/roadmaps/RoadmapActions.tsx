'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { Roadmap } from '@/types/Roadmap';
import { useToastStore } from '@/stores/toast';
import { printHTML } from '@/utils/print-html';
import { generateRoadmapHTML } from './roadmap-pdf';

export default function RoadmapActions({ roadmap }: { roadmap: Roadmap }) {
  const t = useTranslations('RoadmapViewer');
  const locale = useLocale();
  const addToast = useToastStore((s) => s.addToast);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast(t('linkCopied'), 'success');
    } catch {
      // Portapapeles no disponible (permisos/HTTP): no hacemos nada
    }
  };

  const handleExportPDF = () => {
    const html = generateRoadmapHTML(roadmap, locale, {
      steps: t('steps'),
      tips: t('tips'),
      resources: t('resources'),
      by: t('by'),
    });
    printHTML(html);
  };

  return (
    <div className="flex items-center gap-2">
      {roadmap.isPublic && (
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-foreground/10
                   bg-surface/60 text-foreground/70 hover:text-primary-400 hover:border-primary-500/40 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {t('share')}
        </button>
      )}
      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-primary-500 text-white
                 hover:bg-primary-600 transition-colors font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {t('exportPdf')}
      </button>
    </div>
  );
}

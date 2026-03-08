'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export type FilterFieldOption = {
  value: string;
  label: string;
};

export type FilterField = {
  key: string;
  label: string;
  options: FilterFieldOption[];
  /** Optional suffix to append to option labels (e.g., "min" for duration) */
  suffix?: string;
  /** Enable multi-select mode */
  multiSelect?: boolean;
};

type FilterPanelProps = {
  /** Array of filter field configurations */
  fields: FilterField[];
  /** Translations for common labels */
  translations: {
    all: string;
    clear: string;
    apply: string;
    filters?: string;
  };
  /** Number of columns in the grid (kept for API compat, unused) */
  columns?: 1 | 2 | 3 | 4;
  /** Whether to apply filters immediately on change (default: false) */
  immediate?: boolean;
};

export default function FilterPanel({
  fields,
  translations,
  immediate = false,
}: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialFilters = () => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.key] = searchParams.get(field.key) || '';
    });
    return initial;
  };

  const [filters, setFilters] = useState<Record<string, string>>(getInitialFilters);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const newFilters: Record<string, string> = {};
    fields.forEach((field) => {
      newFilters[field.key] = searchParams.get(field.key) || '';
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters(newFilters);
  }, [searchParams, fields]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (immediate) applyFiltersToUrl(newFilters);
  };

  const toggleMulti = (key: string, optionValue: string) => {
    const current = filters[key] ? filters[key].split(',') : [];
    const next = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    handleFilterChange(key, next.join(','));
  };

  const toggleSingle = (key: string, optionValue: string) => {
    handleFilterChange(key, filters[key] === optionValue ? '' : optionValue);
  };

  const applyFiltersToUrl = (filtersToApply: Record<string, string>) => {
    const queryParams = new URLSearchParams();
    Object.entries(filtersToApply).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    const queryString = queryParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const clearFilters = () => {
    const cleared: Record<string, string> = {};
    fields.forEach((f) => { cleared[f.key] = ''; });
    setFilters(cleared);
    router.push(pathname);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  // Collect all active pill labels for the collapsed summary
  const activeSummary = fields.flatMap((field) => {
    const values = filters[field.key] ? filters[field.key].split(',') : [];
    return values.map((v) => field.options.find((o) => o.value === v)?.label ?? v);
  });

  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl mb-6 overflow-hidden">
      {/* Header / toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <svg
          className={`w-3.5 h-3.5 text-[#555555] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <span
          className="text-xs font-semibold text-[#555555] uppercase tracking-widest"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {translations.filters ?? 'Filters'}
        </span>

        {/* Active filter summary pills (only when collapsed) */}
        {!open && activeSummary.length > 0 && (
          <div className="flex flex-wrap gap-1.5 ml-1">
            {activeSummary.map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 rounded-full bg-primary-500/20 border border-primary-500/50 text-primary-400 text-xs font-medium"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Clear button (only when collapsed and active) */}
        {!open && hasActiveFilters && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); clearFilters(); }}
            className="ml-auto text-[#374151] hover:text-[#6B7280] transition-colors"
            aria-label={translations.clear}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </button>

      {/* Expandable content */}
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5">
          {fields.map((field) => {
            const activeValues = filters[field.key] ? filters[field.key].split(',') : [];

            return (
              <div key={field.key} className="pt-4">
                <p
                  className="text-xs font-semibold text-[#555555] uppercase tracking-widest mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {field.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleFilterChange(field.key, '')}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors duration-200 ${
                      activeValues.length === 0
                        ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                        : 'bg-white/5 border-white/10 text-[#6B7280] hover:border-white/20 hover:text-white'
                    }`}
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {translations.all}
                  </button>

                  {field.options.map((option) => {
                    const isActive = activeValues.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          field.multiSelect
                            ? toggleMulti(field.key, option.value)
                            : toggleSingle(field.key, option.value)
                        }
                        className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors duration-200 ${
                          isActive
                            ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                            : 'bg-white/5 border-white/10 text-[#6B7280] hover:border-white/20 hover:text-white'
                        }`}
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {option.label}
                        {field.suffix ? ` ${field.suffix}` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!immediate && (
            <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[#6B7280] text-xs font-medium hover:text-white hover:border-white/20 transition-colors"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {translations.clear}
                </button>
              )}
              <button
                onClick={() => { applyFiltersToUrl(filters); setOpen(false); }}
                className="px-4 py-1.5 rounded-lg bg-primary-500/20 border border-primary-500/50 text-primary-400 text-xs font-medium hover:bg-primary-500/30 transition-colors"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {translations.apply}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

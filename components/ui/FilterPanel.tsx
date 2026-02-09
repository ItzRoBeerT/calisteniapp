'use client';

import { useState, useEffect, useRef } from 'react';
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
  /** Enable multi-select mode with checkboxes */
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
  };
  /** Number of columns in the grid (default: number of fields, max 4) */
  columns?: 1 | 2 | 3 | 4;
  /** Whether to apply filters immediately on change (default: false, shows apply/clear buttons) */
  immediate?: boolean;
};

function MultiSelectDropdown({
  field,
  value,
  onChange,
  allLabel,
}: {
  field: FilterField;
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = value ? value.split(',') : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (optionValue: string) => {
    const newSelected = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue];
    onChange(newSelected.join(','));
  };

  const displayText =
    selected.length === 0
      ? allLabel
      : selected
          .map((v) => field.options.find((o) => o.value === v)?.label || v)
          .join(', ');

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-2 border border-foreground/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left flex justify-between items-center"
      >
        <span className="truncate">{displayText}</span>
        <svg
          className={`w-4 h-4 ml-2 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-background border border-foreground/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {field.options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 px-3 py-2 hover:bg-foreground/10 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                className="rounded border-foreground/20 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">
                {option.label}
                {field.suffix ? ` ${field.suffix}` : ''}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterPanel({
  fields,
  translations,
  columns,
  immediate = false,
}: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const getInitialFilters = () => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.key] = searchParams.get(field.key) || '';
    });
    return initial;
  };

  const [filters, setFilters] = useState<Record<string, string>>(getInitialFilters);

  // Sync with URL params when they change externally
  useEffect(() => {
    const newFilters: Record<string, string> = {};
    fields.forEach((field) => {
      newFilters[field.key] = searchParams.get(field.key) || '';
    });
    setFilters(newFilters);
  }, [searchParams, fields]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (immediate) {
      applyFiltersToUrl(newFilters);
    }
  };

  const applyFiltersToUrl = (filtersToApply: Record<string, string>) => {
    const queryParams = new URLSearchParams();

    Object.entries(filtersToApply).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const applyFilters = () => {
    applyFiltersToUrl(filters);
  };

  const clearFilters = () => {
    const clearedFilters: Record<string, string> = {};
    fields.forEach((field) => {
      clearedFilters[field.key] = '';
    });
    setFilters(clearedFilters);
    router.push(pathname);
  };

  const gridCols = columns || Math.min(fields.length, 4);
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-4',
  }[gridCols];

  return (
    <div className="bg-surface p-4 rounded-xl mb-6">
      <div className={`grid ${gridClass} gap-4`}>
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              {field.label}
            </label>
            {field.multiSelect ? (
              <MultiSelectDropdown
                field={field}
                value={filters[field.key] || ''}
                onChange={(value) => handleFilterChange(field.key, value)}
                allLabel={translations.all}
              />
            ) : (
              <select
                value={filters[field.key] || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                className="w-full p-2 border border-foreground/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">{translations.all}</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                    {field.suffix ? ` ${field.suffix}` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {!immediate && (
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-colors"
          >
            {translations.clear}
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {translations.apply}
          </button>
        </div>
      )}
    </div>
  );
}

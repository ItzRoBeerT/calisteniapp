"use client";
import { useState } from 'react';
import { Link } from '@/i18n/navigation';

const roadmaps = [
  { id: 1, title: 'Principiante', description: 'Empieza desde cero en calistenia.', tags: ['todos'] },
  { id: 2, title: 'Piernas fuertes', description: 'Rutina para fortalecer piernas.', tags: ['piernas', 'todos'] },
  { id: 3, title: 'Bíceps definidos', description: 'Enfocado en bíceps.', tags: ['biceps', 'todos'] },
  { id: 4, title: 'Tríceps avanzados', description: 'Desarrolla tus tríceps.', tags: ['triceps', 'todos'] },
  { id: 5, title: 'Flexibilidad', description: 'Desarrolla movilidad y flexibilidad.', tags: ['todos'] },
  { id: 6, title: 'Resistencia', description: 'Aumenta tu capacidad aeróbica.', tags: ['todos'] },
];

const filters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Piernas', value: 'piernas' },
  { label: 'Bíceps', value: 'biceps' },
  { label: 'Tríceps', value: 'triceps' },
];

export default function RoadmapsList() {
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const filteredRoadmaps = roadmaps.filter(r => r.tags.includes(selectedFilter));

  return (
    <div className="flex gap-8">
      {/* Filtros a la izquierda */}
      <aside className="w-40 min-w-[120px]">
        <div className="flex flex-col gap-2">
          {filters.map(f => (
            <button
              key={f.value}
              className={`px-3 py-2 rounded text-left border hover:bg-primary-100 hover:text-black transition ${selectedFilter === f.value ? 'bg-primary-200 font-bold' : ''}`}
              onClick={() => setSelectedFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </aside>
      {/* Grid de roadmaps */}
      <section className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredRoadmaps.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No hay roadmaps para este filtro.</div>
          ) : (
            filteredRoadmaps.map((roadmap) => (
              <Link
                key={roadmap.id}
                href={`/roadmaps/${roadmap.id}`}
                className="border rounded-lg p-4 bg-surface shadow block transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03] hover:bg-primary-50"
              >
                <h2 className="text-lg font-semibold mb-2">{roadmap.title}</h2>
                <p className="text-sm text-gray-600">{roadmap.description}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

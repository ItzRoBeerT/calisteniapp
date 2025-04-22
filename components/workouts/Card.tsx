import { Link } from '@/i18n/navigation';
import TagList from './TagList';

type WorkoutCardProps = {
  workout: {
    id: string;
    name: string;
    description?: string;
    difficulty?: string;
    duration?: number;
    tags?: string[];
    user_id: string;
  };
  isOwner: boolean;
};

export default function WorkoutCard({ workout, isOwner }: WorkoutCardProps) {
  return (
    <div className="bg-surface rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <Link href={`/workouts/${workout.id}`} className="group">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {workout.name}
        </h3>
      </Link>
      
      {workout.description && (
        <p className="text-gray-600 line-clamp-2 mb-4">
          {workout.description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {workout.difficulty && (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            {workout.difficulty}
          </span>
        )}
        
        {workout.duration && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {workout.duration} min
          </span>
        )}
      </div>
      
      {workout.tags && workout.tags.length > 0 && (
        <div className="mt-3">
          <TagList tags={workout.tags} />
        </div>
      )}
      
      {isOwner && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
          <Link 
            href={`/workouts/${workout.id}/edit`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Editar
          </Link>
          <button 
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
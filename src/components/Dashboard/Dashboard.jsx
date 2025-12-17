import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, ProgressBar, LoadingSpinner } from '../UI';
import { PhaseDetail } from './PhaseDetail';

export function Dashboard() {
  const { tasks, isLoading, validateTechnically } = useTasks();
  const { user } = useAuth();

  if (isLoading) return <LoadingSpinner message="Chargement..." />;

  const total = tasks.reduce((sum, t) => sum + t.progression, 0) / tasks.length || 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
      
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span>Progression globale</span>
          <span className="text-2xl font-bold text-bricol-blue">{Math.round(total)}%</span>
        </div>
        <ProgressBar value={total} />
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{task.phase_name}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <StatusBadge status={task.status} />
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progression</span>
                <span className="font-medium">{task.progression}%</span>
              </div>
              <ProgressBar value={task.progression} />
            </div>

            {user?.permissions?.canValidateTechnically && 
              task.progression >= 80 && 
              task.progression < 85 && (
                <button 
                  onClick={() => validateTechnically(task.id)} 
                  className="btn-primary text-sm mb-3"
                >
                  Valider 85%
                </button>
              )}

            {/* Sous-tâches */}
            <PhaseDetail phase={task} />
          </div>
        ))}
      </div>
    </div>
  );
}

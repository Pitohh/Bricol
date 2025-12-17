import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, LoadingSpinner } from '../UI';

export function Validations() {
  const { tasks, isLoading, approveFinal } = useTasks();
  const { user } = useAuth();
  const pending = tasks.filter(t => t.status === 'en_attente_boss');

  if (isLoading) return <LoadingSpinner message="Chargement..." />;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">✅ Validations ({pending.length})</h2>
      
      {!user?.permissions?.canApproveFinal && (
        <div className="card border-l-4 border-yellow-500 mb-4">
          <p className="text-yellow-700">⚠️ Seul le Chef peut approuver les validations finales.</p>
        </div>
      )}

      {pending.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">Aucune validation en attente</div>
      ) : (
        <div className="space-y-4">
          {pending.map(task => (
            <div key={task.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{task.phase_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="mt-2">
                    <StatusBadge status={task.status} />
                    <span className="ml-3 text-sm text-gray-600">Progression: {task.progression}%</span>
                  </div>
                </div>
                {user?.permissions?.canApproveFinal && (
                  <button onClick={() => approveFinal(task.id)} className="btn-primary">
                    Approuver 15% finaux
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

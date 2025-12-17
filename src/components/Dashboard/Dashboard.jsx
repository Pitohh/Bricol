import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { MetricCard, ProgressBar, StatusBadge, LoadingSpinner } from '../UI';
import { CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { PhaseDetail } from './PhaseDetail';

export function Dashboard() {
  const { tasks, isLoading, validateTechnically } = useTasks();
  const { user } = useAuth();
  const stats = useStats();

  if (isLoading) {
    return <LoadingSpinner message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Progression globale */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-2">
          Tableau de bord
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <ProgressBar value={stats.progressionGlobale} size="lg" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold font-montserrat text-bricol-blue">
              {stats.progressionGlobale}%
            </p>
            <p className="text-sm text-gray-600">Progression globale</p>
          </div>
        </div>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Budget total"
          value={formatCurrency(stats.budgetTotal)}
          icon="💰"
          color="blue"
        />
        <MetricCard
          title="Budget utilisé"
          value={formatCurrency(stats.budgetUtilise)}
          icon="💵"
          color="green"
        />
        <MetricCard
          title="En attente"
          value={stats.tasksEnAttente}
          icon="⏳"
          color="yellow"
        />
        <MetricCard
          title="Terminées"
          value={`${stats.tasksTerminees}/${stats.totalTasks}`}
          icon="✅"
          color="green"
        />
      </div>

      {/* Phases avec sous-tâches */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{task.phase_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              </div>
              <StatusBadge status={task.status} />
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progression</span>
                <span className="text-sm font-semibold">{task.progression}%</span>
              </div>
              <ProgressBar value={task.progression} showLabel={false} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Budget: {formatCurrency(task.estimated_cost)}
              </div>
              
              {user.permissions.canValidateTechnically &&
                task.status === 'en_cours' &&
                task.progression >= 80 &&
                task.progression < 85 && (
                  <button
                    onClick={() => validateTechnically(task.id, user.name)}
                    className="btn-primary text-sm"
                  >
                    Valider 85%
                  </button>
                )}

              {task.status === 'termine' && (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>

            {/* Sous-tâches expandables */}
            <PhaseDetail phase={task} />
          </div>
        ))}
      </div>
    </div>
  );
}

function useStats() {
  const { tasks } = useTasks();

  const budgetTotal = tasks.reduce((sum, task) => sum + (task.estimated_cost || 0), 0);
  const budgetUtilise = tasks
    .filter(t => t.status === 'termine')
    .reduce((sum, task) => sum + (task.actual_cost || task.estimated_cost || 0), 0);

  const progressionGlobale = Math.round(
    tasks.reduce((sum, task) => sum + (task.progression || 0), 0) / (tasks.length || 1)
  );

  return {
    progressionGlobale,
    budgetTotal,
    budgetUtilise,
    budgetRestant: budgetTotal - budgetUtilise,
    tasksTerminees: tasks.filter(t => t.status === 'termine').length,
    tasksEnCours: tasks.filter(t => t.status === 'en_cours').length,
    tasksEnAttente: tasks.filter(t => t.status === 'en_attente_boss').length,
    tasksAFaire: tasks.filter(t => t.status === 'a_faire').length,
    totalTasks: tasks.length
  };
}

function formatCurrency(value) {
  return `${(value / 1000000).toFixed(1)}M XOF`;
}

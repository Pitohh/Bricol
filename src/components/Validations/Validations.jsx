import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner, ProgressBar } from '../UI';
import { CheckCircle, Clock, User, Calendar, AlertTriangle } from 'lucide-react';

export function Validations() {
  const { tasks, isLoading, approveFinal } = useTasks();
  const { user } = useAuth();

  const pendingTasks = tasks.filter(t => t.statut === 'en_attente_boss');
  const canApprove = user.permissions.canApproveFinal;

  if (isLoading) {
    return <LoadingSpinner message="Chargement des validations..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-2">
          Validations en attente
        </h2>
        <p className="text-gray-600">
          {pendingTasks.length > 0
            ? `${pendingTasks.length} phase${pendingTasks.length > 1 ? 's' : ''} en attente d'approbation finale`
            : 'Aucune validation en attente'}
        </p>
      </div>

      {/* Message d'information si pas de permission */}
      {!canApprove && pendingTasks.length > 0 && (
        <div className="card mb-6 border-l-4 border-yellow-500 bg-yellow-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Permissions insuffisantes
              </h3>
              <p className="text-sm text-yellow-700">
                Seul le Chef de Projet (Boss) peut approuver les 15% finaux des validations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Liste des validations */}
      {pendingTasks.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Toutes les validations sont à jour !
          </h3>
          <p className="text-gray-600">
            Aucune phase n'est en attente d'approbation finale.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTasks.map(task => (
            <ValidationCard
              key={task.id}
              task={task}
              canApprove={canApprove}
              onApprove={() => approveFinal(task.id, user.name)}
            />
          ))}
        </div>
      )}

      {/* Historique des validations récentes */}
      {tasks.filter(t => t.statut === 'termine').length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold font-montserrat mb-4">
            Validations récentes
          </h3>
          <div className="space-y-3">
            {tasks
              .filter(t => t.statut === 'termine')
              .slice(-3)
              .reverse()
              .map(task => (
                <CompletedValidationCard key={task.id} task={task} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ValidationCard({ task, canApprove, onApprove }) {
  return (
    <div className="card border-l-4 border-yellow-500 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Informations de la tâche */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {task.phase}
              </h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          </div>

          {/* Progression */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression</span>
              <span className="text-sm font-bold text-yellow-600">85%</span>
            </div>
            <ProgressBar value={85} color="orange" showLabel={false} />
            <p className="text-xs text-gray-500 mt-1">
              En attente des 15% finaux pour atteindre 100%
            </p>
          </div>

          {/* Informations de validation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4 text-gray-400" />
              <span>
                Validé par: <span className="font-medium text-gray-900">{task.validatedBy}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Le: {formatDate(task.validatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end space-y-3">
          {/* Cercle de progression */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.85)}`}
                className="text-yellow-500 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">85%</span>
            </div>
          </div>

          {/* Bouton d'approbation */}
          {canApprove ? (
            <button onClick={onApprove} className="btn-primary whitespace-nowrap">
              <CheckCircle className="w-5 h-5 mr-2 inline" />
              Approuver 15% finaux
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-yellow-600 text-sm">
              <Clock className="w-5 h-5" />
              <span>En attente Boss</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompletedValidationCard({ task }) {
  return (
    <div className="card border-l-4 border-green-500 bg-green-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <h4 className="font-semibold text-gray-900">{task.phase}</h4>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-9">
            <span>✓ Validé par {task.validatedBy}</span>
            <span>✓ Approuvé par {task.approvedBy}</span>
            <span>• {formatDate(task.approvedAt)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">100%</div>
          <div className="text-xs text-green-600">Terminé</div>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

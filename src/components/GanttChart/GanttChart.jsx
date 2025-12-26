import { useTasks } from '../../contexts/TaskContext';

export function GanttChart() {
  const { phases = [] } = useTasks();

  if (!phases || phases.length === 0) {
    return null;
  }

  const getProgressColor = (progression) => {
    if (progression >= 100) return 'bg-green-600';
    if (progression >= 70) return 'bg-orange-500';
    if (progression >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'termine': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-orange-100 text-orange-800';
      case 'en_attente_boss': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'termine': return '✅ Terminée';
      case 'en_cours': return '🔄 En cours';
      case 'en_attente_boss': return '⏳ Validation';
      case 'a_faire': return '📋 À faire';
      default: return status;
    }
  };

  // Calculer progression globale
  const globalProgress = phases.length > 0
    ? Math.round(phases.reduce((sum, p) => sum + (p.progression || 0), 0) / phases.length)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Planning d'avancement</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">Progression globale</div>
          <div className="text-2xl font-bold text-bricol-blue">{globalProgress}%</div>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${getProgressColor(globalProgress)}`}
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </div>

      {/* Timeline des phases */}
      <div className="space-y-3">
        {phases.map((phase, index) => (
          <div key={phase.id} className="relative">
            <div className="flex items-center space-x-3">
              {/* Numéro */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bricol-blue text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* Nom et progression */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{phase.phase_name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(phase.status)}`}>
                      {getStatusLabel(phase.status)}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 min-w-[3rem] text-right">
                      {phase.progression}%
                    </span>
                  </div>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${getProgressColor(phase.progression)}`}
                    style={{ width: `${phase.progression}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

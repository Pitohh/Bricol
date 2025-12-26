import { useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext';

export function GanttView() {
  const { phases = [], loading, fetchPhases } = useTasks();

  useEffect(() => {
    if (!phases || phases.length === 0) {
      fetchPhases();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bricol-blue"></div>
      </div>
    );
  }

  if (!phases || phases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">Aucune phase à afficher</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Planning Gantt</h2>
      
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {index + 1}. {phase.phase_name}
                </h3>
                <p className="text-sm text-gray-600">{phase.description}</p>
              </div>
              <div className="text-right ml-4">
                <span className="text-lg font-bold text-gray-900">
                  {phase.progression}%
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all ${
                  phase.progression >= 100 ? 'bg-green-600' :
                  phase.progression >= 70 ? 'bg-orange-500' :
                  phase.progression >= 40 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
                style={{ width: `${phase.progression}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>
                {phase.status === 'termine' ? '✅ Terminé' :
                 phase.status === 'en_cours' ? '🔄 En cours' :
                 phase.status === 'en_attente_boss' ? '⏳ En attente validation' : '📋 À faire'}
              </span>
              <span>
                Budget: {(phase.estimated_cost || 0).toLocaleString('fr-FR')} XOF
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

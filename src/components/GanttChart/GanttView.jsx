import { useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { GanttChart } from './GanttChart';

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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Planning Gantt
        </h1>
        <p className="text-gray-600">
          Vue chronologique de l'avancement des travaux
        </p>
      </div>

      <GanttChart />

      {phases && phases.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Détails des phases</h3>
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {index + 1}. {phase.phase_name}
                  </h4>
                  <span className="text-sm text-gray-600">
                    Budget: {(phase.estimated_cost || 0).toLocaleString('fr-FR')} XOF
                  </span>
                </div>
                <p className="text-sm text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

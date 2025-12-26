import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import { projectApi, phasesApi } from '../../utils/api';

export function CostsView() {
  const { user } = useAuth();
  const { phases = [], fetchPhases } = useTasks();
  const [project, setProject] = useState(null);

  useEffect(() => {
    loadProject();
    fetchPhases();
  }, []);

  const loadProject = async () => {
    try {
      const data = await projectApi.get();
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const handleActualCostUpdate = async (phaseId, actualCost) => {
    try {
      await phasesApi.updateActualCost(phaseId, actualCost);
      fetchPhases();
      alert('✅ Coût réel mis à jour !');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    }
  };

  const totalBudget = project?.total_budget || 10000000;
  const totalSpent = phases.reduce((sum, p) => sum + parseInt(p.actual_cost || 0), 0);
  const totalEstimated = phases.reduce((sum, p) => sum + parseInt(p.estimated_cost || 0), 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-2">Suivi des coûts</h2>
        <p className="text-gray-600">Vue d'ensemble des dépenses réelles vs budget prévu</p>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-sm text-gray-600 mb-1">Budget Total</div>
          <div className="text-2xl font-bold text-blue-600">
            {totalBudget.toLocaleString('fr-FR')} XOF
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-sm text-gray-600 mb-1">Dépensé</div>
          <div className="text-2xl font-bold text-orange-600">
            {totalSpent.toLocaleString('fr-FR')} XOF
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% du budget
          </div>
        </div>
        <div className={`rounded-lg shadow-sm p-6 ${remaining >= 0 ? 'bg-white' : 'bg-red-50'}`}>
          <div className="text-sm text-gray-600 mb-1">Restant</div>
          <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remaining.toLocaleString('fr-FR')} XOF
          </div>
          {remaining < 0 && (
            <div className="text-xs text-red-600 mt-1 font-semibold">⚠️ Dépassement</div>
          )}
        </div>
      </div>

      {/* Détails par phase */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Détails par phase</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Phase</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Budget prévu</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Coût réel</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Écart</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Statut</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((phase) => {
                const estimated = parseInt(phase.estimated_cost || 0);
                const actual = parseInt(phase.actual_cost || 0);
                const variance = estimated - actual;
                const isOverBudget = variance < 0;

                return (
                  <tr key={phase.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{phase.phase_name}</div>
                      <div className="text-xs text-gray-500">{phase.progression}% complété</div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {estimated.toLocaleString('fr-FR')} XOF
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user?.permissions?.canEditBudget ? (
                        <input
                          type="number"
                          defaultValue={actual}
                          onBlur={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            if (newValue !== actual) {
                              handleActualCostUpdate(phase.id, newValue);
                            }
                          }}
                          className="input text-right w-40"
                        />
                      ) : (
                        <span className="text-gray-900">{actual.toLocaleString('fr-FR')} XOF</span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {isOverBudget ? '⚠️ ' : '✓ '}
                      {Math.abs(variance).toLocaleString('fr-FR')} XOF
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isOverBudget && actual > 0 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Hors budget
                        </span>
                      ) : actual > 0 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Dans le budget
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          Pas de dépenses
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

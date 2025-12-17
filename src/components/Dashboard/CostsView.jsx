import { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { phasesApi } from '../../utils/api';
import { DollarSign, Save } from 'lucide-react';

export function CostsView() {
  const { tasks, refreshTasks } = useTasks();
  const { user } = useAuth();
  const [actualCosts, setActualCosts] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (value) => `${(value / 1000000).toFixed(2)}M XOF`;

  const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimated_cost || 0), 0);
  const totalActual = tasks.reduce((sum, t) => sum + (t.actual_cost || 0), 0);
  const totalRemaining = totalEstimated - totalActual;

  const handleUpdateActualCost = async (phaseId, cost) => {
    setIsSaving(true);
    try {
      await phasesApi.updateActualCost(phaseId, cost);
      await refreshTasks();
      alert('✅ Coût réel mis à jour !');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">💵 Suivi des Coûts</h2>

      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Budget Total</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalEstimated)}</p>
        </div>
        <div className="card border-l-4 border-orange-500">
          <p className="text-sm text-gray-600 mb-1">Dépensé</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalActual)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {((totalActual / totalEstimated) * 100).toFixed(1)}% du budget
          </p>
        </div>
        <div className="card border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Restant</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRemaining)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {((totalRemaining / totalEstimated) * 100).toFixed(1)}% disponible
          </p>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Détail par Phase</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phase</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Budget Prévu</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Coût Réel</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Écart</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map(task => {
                const variance = (task.actual_cost || 0) - (task.estimated_cost || 0);
                const isOverBudget = variance > 0;

                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{task.phase_name}</p>
                      <p className="text-xs text-gray-500">{task.progression}% complété</p>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {formatCurrency(task.estimated_cost || 0)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user?.permissions?.canEditBudget ? (
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            defaultValue={task.actual_cost || 0}
                            onChange={(e) => setActualCosts({ ...actualCosts, [task.id]: Number(e.target.value) })}
                            className="input w-32 text-right text-sm"
                            step="10000"
                          />
                          <button
                            onClick={() => handleUpdateActualCost(task.id, actualCosts[task.id] || task.actual_cost || 0)}
                            disabled={isSaving}
                            className="btn-primary px-2 py-1 text-xs"
                          >
                            <Save className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm">{formatCurrency(task.actual_cost || 0)}</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {isOverBudget ? '+' : ''}{formatCurrency(variance)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isOverBudget && (
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          ⚠️ Dépassement
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-bold">
              <tr>
                <td className="px-4 py-3">TOTAL</td>
                <td className="px-4 py-3 text-right">{formatCurrency(totalEstimated)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(totalActual)}</td>
                <td className={`px-4 py-3 text-right ${(totalActual - totalEstimated) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {(totalActual - totalEstimated) > 0 ? '+' : ''}{formatCurrency(totalActual - totalEstimated)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

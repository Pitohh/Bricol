import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import { projectApi, phasesApi } from '../../utils/api';

export function BudgetForm() {
  const { user } = useAuth();
  const { phases = [], fetchPhases } = useTasks();
  const [globalBudget, setGlobalBudget] = useState(10000000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProject();
    fetchPhases();
  }, []);

  const loadProject = async () => {
    try {
      const project = await projectApi.get();
      setGlobalBudget(project.total_budget || 10000000);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const handleGlobalBudgetSave = async () => {
    setLoading(true);
    try {
      await projectApi.updateBudget(globalBudget);
      alert('✅ Budget global mis à jour !');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhaseBudgetUpdate = async (phaseId, newCost) => {
    try {
      await phasesApi.updateBudget(phaseId, newCost);
      fetchPhases();
      alert('✅ Budget de la phase mis à jour !');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    }
  };

  if (!user?.permissions?.canEditBudget) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">🔒 Accès réservé au Chef de Projet</p>
      </div>
    );
  }

  const totalAllocated = phases.reduce((sum, p) => sum + parseInt(p.estimated_cost || 0), 0);
  const remaining = globalBudget - totalAllocated;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-2">Gestion des budgets</h2>
        <p className="text-gray-600">Modification des budgets du projet et des phases</p>
      </div>

      {/* Budget Global */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Budget Global du Projet</h3>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget total (XOF)
            </label>
            <input
              type="number"
              value={globalBudget}
              onChange={(e) => setGlobalBudget(parseInt(e.target.value) || 0)}
              className="input text-lg font-semibold"
            />
          </div>
          <button
            onClick={handleGlobalBudgetSave}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Budget total</div>
            <div className="text-xl font-bold text-blue-600">
              {globalBudget.toLocaleString('fr-FR')} XOF
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Alloué aux phases</div>
            <div className="text-xl font-bold text-orange-600">
              {totalAllocated.toLocaleString('fr-FR')} XOF
            </div>
          </div>
          <div className={`p-4 rounded-lg ${remaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm text-gray-600">Restant</div>
            <div className={`text-xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remaining.toLocaleString('fr-FR')} XOF
            </div>
          </div>
        </div>
      </div>

      {/* Budgets par phase */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Budgets par Phase</h3>
        <div className="space-y-4">
          {phases.map((phase) => (
            <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{phase.phase_name}</h4>
                <span className="text-sm text-gray-600">{phase.progression}%</span>
              </div>
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Budget estimé (XOF)
                  </label>
                  <input
                    type="number"
                    defaultValue={phase.estimated_cost}
                    onBlur={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      if (newValue !== phase.estimated_cost) {
                        handlePhaseBudgetUpdate(phase.id, newValue);
                      }
                    }}
                    className="input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

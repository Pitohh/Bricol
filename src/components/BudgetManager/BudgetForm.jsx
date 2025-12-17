import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import { projectApi } from '../../utils/api';
import { DollarSign, Save, Edit2 } from 'lucide-react';

export function BudgetForm() {
  const { user } = useAuth();
  const { tasks, updatePhaseBudget, refreshTasks } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [globalBudget, setGlobalBudget] = useState(10000000);
  const [phaseBudgets, setPhaseBudgets] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Charger le budget global
    projectApi.get().then(project => {
      setGlobalBudget(project.total_budget);
    });

    // Initialiser les budgets des phases
    const budgets = {};
    tasks.forEach(task => {
      budgets[task.id] = task.estimated_cost;
    });
    setPhaseBudgets(budgets);
  }, [tasks]);

  const handleSaveGlobalBudget = async () => {
    setIsSaving(true);
    try {
      await projectApi.updateBudget(globalBudget);
      alert('Budget global mis à jour !');
    } catch (error) {
      alert('Erreur : ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePhaseBudget = async (phaseId) => {
    setIsSaving(true);
    try {
      await updatePhaseBudget(phaseId, phaseBudgets[phaseId]);
      await refreshTasks();
      alert('Budget de la phase mis à jour !');
    } catch (error) {
      alert('Erreur : ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value) => {
    return `${(value / 1000000).toFixed(1)}M XOF`;
  };

  const totalPhaseBudgets = Object.values(phaseBudgets).reduce((sum, val) => sum + val, 0);
  const budgetDiff = globalBudget - totalPhaseBudgets;

  if (!user?.permissions?.canEditBudget) {
    return (
      <div className="card border-l-4 border-red-500">
        <p className="text-red-700">
          ⚠️ Seul le Chef de Projet peut modifier les budgets.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Global */}
      <div className="card border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold font-montserrat flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
            Budget Global du Projet
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-ghost"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {isEditing ? (
            <>
              <input
                type="number"
                value={globalBudget}
                onChange={(e) => setGlobalBudget(Number(e.target.value))}
                className="input flex-1"
                step="100000"
              />
              <button
                onClick={handleSaveGlobalBudget}
                disabled={isSaving}
                className="btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </button>
            </>
          ) : (
            <div className="flex-1">
              <p className="text-4xl font-bold text-blue-600">
                {formatCurrency(globalBudget)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Budget total alloué au projet
              </p>
            </div>
          )}
        </div>

        {/* Indicateur de différence */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total budgets phases :</span>
            <span className="font-semibold">{formatCurrency(totalPhaseBudgets)}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Différence :</span>
            <span className={`font-bold ${budgetDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {budgetDiff >= 0 ? '+' : ''}{formatCurrency(budgetDiff)}
            </span>
          </div>
        </div>
      </div>

      {/* Budgets par Phase */}
      <div className="card">
        <h3 className="text-lg font-bold font-montserrat mb-4">
          Budgets par Phase
        </h3>

        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{task.phase_name}</p>
                <p className="text-xs text-gray-600">{task.description}</p>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={phaseBudgets[task.id] || 0}
                  onChange={(e) => setPhaseBudgets({
                    ...phaseBudgets,
                    [task.id]: Number(e.target.value)
                  })}
                  className="input w-32 text-right"
                  step="10000"
                />
                <span className="text-sm text-gray-600 w-24">
                  {formatCurrency(phaseBudgets[task.id] || 0)}
                </span>
                <button
                  onClick={() => handleSavePhaseBudget(task.id)}
                  disabled={isSaving}
                  className="btn-primary text-sm px-3 py-1"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

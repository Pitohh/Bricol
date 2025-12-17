#!/bin/bash

echo "🔧 MEGA FIX - Correction de tous les bugs"
echo "=========================================="
echo ""

# 1. Corriger SubTaskList - gérer les erreurs gracieusement
echo "🔨 Correction SubTaskList..."
cat > src/components/SubTasks/SubTaskList.jsx << 'EOF'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subTasksApi } from '../../utils/api';
import { Plus, CheckCircle, Clock } from 'lucide-react';
import { SubTaskForm } from './SubTaskForm';

export function SubTaskList({ phase }) {
  const { user } = useAuth();
  const [subTasks, setSubTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubTasks();
  }, [phase.id]);

  const loadSubTasks = async () => {
    try {
      setError(null);
      const data = await subTasksApi.getByPhase(phase.id);
      setSubTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading subtasks:', error);
      setError('Impossible de charger les sous-tâches');
      setSubTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressChange = async (subTaskId, progression) => {
    try {
      await subTasksApi.updateProgression(subTaskId, progression);
      loadSubTasks();
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          Sous-tâches ({subTasks.length})
        </h4>
        
        {user?.permissions?.canCreateSubTasks && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-xs px-2 py-1"
          >
            <Plus className="w-3 h-3 inline mr-1" />
            Ajouter
          </button>
        )}
      </div>

      {showForm && (
        <SubTaskForm
          phaseId={phase.id}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadSubTasks();
          }}
        />
      )}

      {subTasks.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Aucune sous-tâche pour cette phase
        </p>
      ) : (
        <div className="space-y-2">
          {subTasks.map(subTask => (
            <div key={subTask.id} className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-900">{subTask.task_name}</h5>
                  {subTask.description && (
                    <p className="text-xs text-gray-600 mt-1">{subTask.description}</p>
                  )}
                </div>
                {subTask.status === 'termine' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-orange-600" />
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subTask.progression || 0}
                  onChange={(e) => handleProgressChange(subTask.id, Number(e.target.value))}
                  className="flex-1"
                  disabled={subTask.status === 'termine'}
                />
                <span className="text-xs font-medium text-gray-700 w-12">
                  {subTask.progression || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
EOF

# 2. Corriger GanttView - version simplifiée qui marche toujours
echo "📊 Correction GanttView..."
cat > src/components/GanttChart/GanttView.jsx << 'EOF'
import { useTasks } from '../../contexts/TaskContext';

export function GanttView() {
  const { tasks, isLoading } = useTasks();

  if (isLoading) {
    return <div className="container mx-auto px-4 py-6">Chargement...</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'termine': return 'bg-green-500';
      case 'en_cours': return 'bg-orange-500';
      case 'en_attente_boss': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="card">
        <h3 className="text-xl font-bold font-montserrat mb-6">
          📊 Planning de Gantt
        </h3>

        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium w-48 truncate">
                  {task.phase_name}
                </span>
                <span className="text-xs text-gray-500">
                  {task.progression}%
                </span>
              </div>

              <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${getStatusColor(task.status)} flex items-center justify-center text-white text-xs font-medium transition-all duration-500`}
                  style={{ width: `${task.progression}%` }}
                >
                  {task.progression > 10 && <span>{task.progression}%</span>}
                </div>
              </div>

              {task.start_date && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Début: {new Date(task.start_date).toLocaleDateString('fr-FR')}</span>
                  {task.end_date && (
                    <span>Fin: {new Date(task.end_date).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span>Terminé</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
            <span>En cours</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>En attente</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
            <span>À faire</span>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# 3. Corriger BudgetForm - gérer les erreurs
echo "💰 Correction BudgetForm..."
cat > src/components/BudgetManager/BudgetForm.jsx << 'EOF'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import { projectApi } from '../../utils/api';
import { DollarSign, Save } from 'lucide-react';

export function BudgetForm() {
  const { user } = useAuth();
  const { tasks, updatePhaseBudget, refreshTasks } = useTasks();
  const [globalBudget, setGlobalBudget] = useState(10000000);
  const [phaseBudgets, setPhaseBudgets] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    projectApi.get()
      .then(project => setGlobalBudget(project.total_budget))
      .catch(() => setGlobalBudget(10000000));

    const budgets = {};
    tasks.forEach(task => {
      budgets[task.id] = task.estimated_cost || 0;
    });
    setPhaseBudgets(budgets);
  }, [tasks]);

  if (!user?.permissions?.canEditBudget) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="card border-l-4 border-red-500">
          <p className="text-red-700">
            ⚠️ Seul le Chef de Projet peut modifier les budgets.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveGlobalBudget = async () => {
    setIsSaving(true);
    try {
      await projectApi.updateBudget(globalBudget);
      alert('✅ Budget global mis à jour !');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePhaseBudget = async (phaseId) => {
    setIsSaving(true);
    try {
      await updatePhaseBudget(phaseId, phaseBudgets[phaseId]);
      await refreshTasks();
      alert('✅ Budget de la phase mis à jour !');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value) => `${(value / 1000000).toFixed(1)}M XOF`;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="card border-l-4 border-blue-500">
          <h3 className="text-xl font-bold font-montserrat mb-4 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
            Budget Global
          </h3>

          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={globalBudget}
              onChange={(e) => setGlobalBudget(Number(e.target.value))}
              className="input flex-1"
              step="100000"
            />
            <span className="text-lg font-semibold">{formatCurrency(globalBudget)}</span>
            <button
              onClick={handleSaveGlobalBudget}
              disabled={isSaving}
              className="btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-4">Budgets par Phase</h3>
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium">{task.phase_name}</p>
                </div>
                <input
                  type="number"
                  value={phaseBudgets[task.id] || 0}
                  onChange={(e) => setPhaseBudgets({
                    ...phaseBudgets,
                    [task.id]: Number(e.target.value)
                  })}
                  className="input w-32"
                  step="10000"
                />
                <span className="text-sm w-24">{formatCurrency(phaseBudgets[task.id] || 0)}</span>
                <button
                  onClick={() => handleSavePhaseBudget(task.id)}
                  disabled={isSaving}
                  className="btn-primary text-sm px-3 py-1"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo ""
echo "✅ Tous les composants corrigés !"
echo ""
echo "🔄 Redémarrez le frontend : npm run dev"
echo ""

#!/bin/bash

echo "🔨 Ajout de TOUTES les fonctionnalités manquantes..."
echo ""

# ============================================
# 1. BUDGET FORM COMPLET (pour Michael)
# ============================================
echo "💰 Création BudgetForm complet..."
cat > src/components/BudgetManager/BudgetForm.jsx << 'EOF'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import { projectApi, phasesApi } from '../../utils/api';
import { DollarSign, Save, Edit2 } from 'lucide-react';

export function BudgetForm() {
  const { user } = useAuth();
  const { tasks, refreshTasks } = useTasks();
  const [globalBudget, setGlobalBudget] = useState(10000000);
  const [phaseBudgets, setPhaseBudgets] = useState({});
  const [isEditingGlobal, setIsEditingGlobal] = useState(false);
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
          <p className="text-red-700">⚠️ Seul le Chef de Projet peut modifier les budgets.</p>
        </div>
      </div>
    );
  }

  const handleSaveGlobalBudget = async () => {
    setIsSaving(true);
    try {
      await projectApi.updateBudget(globalBudget);
      alert('✅ Budget global mis à jour !');
      setIsEditingGlobal(false);
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePhaseBudget = async (phaseId) => {
    setIsSaving(true);
    try {
      await phasesApi.updateBudget(phaseId, phaseBudgets[phaseId]);
      await refreshTasks();
      alert('✅ Budget de la phase mis à jour !');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value) => `${(value / 1000000).toFixed(2)}M XOF`;
  const totalPhaseBudgets = Object.values(phaseBudgets).reduce((sum, val) => sum + (val || 0), 0);
  const budgetDiff = globalBudget - totalPhaseBudgets;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Budget Global */}
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
              Budget Global du Projet
            </h3>
            {!isEditingGlobal && (
              <button onClick={() => setIsEditingGlobal(true)} className="btn-ghost">
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {isEditingGlobal ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={globalBudget}
                  onChange={(e) => setGlobalBudget(Number(e.target.value))}
                  className="input flex-1"
                  step="100000"
                />
                <span className="text-lg font-semibold text-gray-700 w-32">
                  {formatCurrency(globalBudget)}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveGlobalBudget} disabled={isSaving} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </button>
                <button onClick={() => setIsEditingGlobal(false)} className="btn-ghost">
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-4xl font-bold text-blue-600">{formatCurrency(globalBudget)}</p>
              <p className="text-sm text-gray-600 mt-1">Budget total alloué au projet</p>
            </div>
          )}

          {/* Récap */}
          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total budgets phases :</span>
              <span className="font-semibold">{formatCurrency(totalPhaseBudgets)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Différence :</span>
              <span className={`font-bold ${budgetDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {budgetDiff >= 0 ? '+' : ''}{formatCurrency(budgetDiff)}
              </span>
            </div>
          </div>
        </div>

        {/* Budgets par Phase */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Budgets par Phase</h3>
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{task.phase_name}</p>
                  <p className="text-xs text-gray-600 truncate">{task.description}</p>
                </div>
                <input
                  type="number"
                  value={phaseBudgets[task.id] || 0}
                  onChange={(e) => setPhaseBudgets({
                    ...phaseBudgets,
                    [task.id]: Number(e.target.value)
                  })}
                  className="input w-40 text-right"
                  step="10000"
                />
                <span className="text-sm text-gray-700 w-24 text-right">
                  {formatCurrency(phaseBudgets[task.id] || 0)}
                </span>
                <button
                  onClick={() => handleSavePhaseBudget(task.id)}
                  disabled={isSaving}
                  className="btn-primary px-3 py-2"
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

# ============================================
# 2. VUE COÛTS COMPLÈTE
# ============================================
echo "💵 Création CostsView complet..."
cat > src/components/Dashboard/CostsView.jsx << 'EOF'
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
EOF

# ============================================
# 3. METTRE À JOUR L'API pour les coûts réels
# ============================================
echo "🔧 Mise à jour API..."
cat > src/utils/api.js << 'EOF'
const API_URL = 'http://localhost:3001';
const getToken = () => localStorage.getItem('bricol_token');

export const api = {
  async request(endpoint, options = {}) {
    const token = getToken();
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur API');
    }
    return response.json();
  },
  get(endpoint) { return this.request(endpoint); },
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); },
  put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); },
};

export const authApi = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
};

export const projectApi = {
  get: () => api.get('/api/project'),
  updateBudget: (total_budget) => api.put('/api/project/budget', { total_budget }),
};

export const phasesApi = {
  getAll: () => api.get('/api/phases'),
  updateBudget: (id, estimated_cost) => api.put(`/api/phases/${id}/budget`, { estimated_cost }),
  updateActualCost: (id, actual_cost) => api.put(`/api/phases/${id}/actual-cost`, { actual_cost }),
  validate: (id) => api.post(`/api/phases/${id}/validate`),
  approve: (id) => api.post(`/api/phases/${id}/approve`),
};

export const subTasksApi = {
  getByPhase: (phaseId) => api.get(`/api/subtasks/phase/${phaseId}`),
  create: (data) => api.post('/api/subtasks', data),
  updateProgression: (id, progression) => api.put(`/api/subtasks/${id}/progression`, { progression }),
};
EOF

# ============================================
# 4. AJOUTER LA ROUTE BACKEND pour actual_cost
# ============================================
echo "🔧 Ajout route actual_cost backend..."
cat >> server/routes/phases.js << 'EOF'

// Update actual cost (Chef only)
router.put('/:id/actual-cost', (req, res) => {
  const { id } = req.params;
  const { actual_cost } = req.body;

  try {
    db.prepare('UPDATE phases SET actual_cost = ? WHERE id = ?')
      .run(actual_cost, id);

    const phase = db.prepare('SELECT * FROM phases WHERE id = ?').get(id);
    phase.assigned_to = JSON.parse(phase.assigned_to);

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
EOF

# ============================================
# 5. METTRE À JOUR APP.JSX avec l'onglet Coûts
# ============================================
echo "📱 Mise à jour App.jsx avec onglet Coûts..."
cat > src/App.jsx << 'EOF'
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider, useTasks } from './contexts/TaskContext';
import { LoginModal } from './components/Auth/LoginModal';
import { Header } from './components/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { GanttView } from './components/GanttChart/GanttView';
import { Validations } from './components/Validations/Validations';
import { BudgetForm } from './components/BudgetManager/BudgetForm';
import { CostsView } from './components/Dashboard/CostsView';
import { LoadingSpinner } from './components/UI';

function AppContent() {
  const { user, isLoading } = useAuth();
  const { tasks } = useTasks();
  const [activeTab, setActiveTab] = useState('dashboard');

  const pending = tasks.filter(t => t.status === 'en_attente_boss').length;

  if (isLoading) return <LoadingSpinner message="Chargement..." />;
  if (!user) return <LoginModal />;

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', show: true },
    { id: 'gantt', label: '📈 Gantt', show: true },
    { id: 'validations', label: `✅ Validations ${pending > 0 ? `(${pending})` : ''}`, show: true },
    { id: 'budget', label: '💰 Budget', show: user?.permissions?.canEditBudget },
    { id: 'costs', label: '💵 Coûts', show: true },
  ].filter(t => t.show);

  return (
    <div className="min-h-screen bg-bricol-gray-light">
      <Header />
      <nav className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="container mx-auto px-4 flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.id ? 'border-bricol-blue text-bricol-blue' : 'border-transparent text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
      <main>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'gantt' && <GanttView />}
        {activeTab === 'validations' && <Validations />}
        {activeTab === 'budget' && <BudgetForm />}
        {activeTab === 'costs' && <CostsView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
}
EOF

echo ""
echo "✅ TOUTES les fonctionnalités ajoutées !"
echo ""
echo "Nouvelles fonctionnalités :"
echo "  ✅ Budget : Modifier budget global et par phase"
echo "  ✅ Coûts : Suivre coûts réels vs prévus"
echo "  ✅ Validations : Approuver les phases à 100%"
echo ""
echo "🔄 Redémarrez maintenant :"
echo "   pkill -f node"
echo "   sleep 2"
echo "   npm run dev:all"
echo ""

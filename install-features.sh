#!/bin/bash

echo "🎯 Installation des nouvelles fonctionnalités v2.0"
echo "=================================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. BUDGET MANAGER - Formulaire pour le Chef
echo -e "${BLUE}💰 Création Budget Manager...${NC}"

cat > src/components/BudgetManager/BudgetForm.jsx << 'EOF'
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
EOF

# 2. SOUS-TÂCHES - Gestion par le Coordinateur
echo -e "${BLUE}🔨 Création Sous-Tâches Manager...${NC}"

cat > src/components/SubTasks/SubTaskList.jsx << 'EOF'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subTasksApi, photosApi, reportsApi } from '../../utils/api';
import { Plus, Image, FileText, CheckCircle, Clock } from 'lucide-react';
import { SubTaskForm } from './SubTaskForm';
import { PhotoUpload } from './PhotoUpload';

export function SubTaskList({ phase }) {
  const { user } = useAuth();
  const [subTasks, setSubTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState(null);

  useEffect(() => {
    loadSubTasks();
  }, [phase.id]);

  const loadSubTasks = async () => {
    try {
      const data = await subTasksApi.getByPhase(phase.id);
      setSubTasks(data);
    } catch (error) {
      console.error('Error loading subtasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateSubTask = async (subTaskId) => {
    try {
      await subTasksApi.validate(subTaskId);
      loadSubTasks();
    } catch (error) {
      alert('Erreur : ' + error.message);
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
    return <div className="text-center py-8">Chargement des sous-tâches...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">
          Sous-tâches ({subTasks.length})
        </h4>
        
        {user?.permissions?.canCreateSubTasks && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter une sous-tâche
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
        <div className="text-center py-8 text-gray-500">
          Aucune sous-tâche pour cette phase
        </div>
      ) : (
        <div className="space-y-3">
          {subTasks.map(subTask => (
            <div key={subTask.id} className="card bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900">{subTask.task_name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{subTask.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {subTask.status === 'termine' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-600" />
                  )}
                </div>
              </div>

              {/* Progression */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-semibold">{subTask.progression}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subTask.progression}
                  onChange={(e) => handleProgressChange(subTask.id, Number(e.target.value))}
                  className="w-full"
                  disabled={subTask.status === 'termine'}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedSubTask(subTask.id)}
                  className="btn-ghost text-sm"
                >
                  <Image className="w-4 h-4 mr-1" />
                  Photos
                </button>
                
                <button
                  onClick={() => alert('Rapport : Feature en cours')}
                  className="btn-ghost text-sm"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Rapport
                </button>

                {user?.permissions?.canValidateTechnically && subTask.status !== 'termine' && (
                  <button
                    onClick={() => handleValidateSubTask(subTask.id)}
                    className="btn-primary text-sm ml-auto"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Valider
                  </button>
                )}
              </div>

              {/* Upload Photos */}
              {selectedSubTask === subTask.id && (
                <PhotoUpload
                  subTaskId={subTask.id}
                  onClose={() => setSelectedSubTask(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
EOF

cat > src/components/SubTasks/SubTaskForm.jsx << 'EOF'
import { useState } from 'react';
import { subTasksApi } from '../../utils/api';
import { X } from 'lucide-react';

export function SubTaskForm({ phaseId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    task_name: '',
    description: '',
    estimated_cost: 0,
    start_date: new Date().toISOString().split('T')[0]
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await subTasksApi.create({
        phase_id: phaseId,
        ...formData
      });
      onSuccess();
    } catch (error) {
      alert('Erreur : ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card border-l-4 border-green-500 animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Nouvelle sous-tâche</h4>
        <button onClick={onClose} className="btn-ghost p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label">Nom de la sous-tâche</label>
          <input
            type="text"
            value={formData.task_name}
            onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Coût estimé (XOF)</label>
            <input
              type="number"
              value={formData.estimated_cost}
              onChange={(e) => setFormData({ ...formData, estimated_cost: Number(e.target.value) })}
              className="input"
              step="1000"
            />
          </div>

          <div>
            <label className="label">Date de début</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="btn-ghost">
            Annuler
          </button>
          <button type="submit" disabled={isSaving} className="btn-primary">
            {isSaving ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
EOF

cat > src/components/SubTasks/PhotoUpload.jsx << 'EOF'
import { useState, useEffect } from 'react';
import { photosApi } from '../../utils/api';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export function PhotoUpload({ subTaskId, onClose }) {
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [subTaskId]);

  const loadPhotos = async () => {
    try {
      const data = await photosApi.getBySubTask(subTaskId);
      setPhotos(data);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await photosApi.upload(subTaskId, file);
      loadPhotos();
    } catch (error) {
      alert('Erreur upload : ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-semibold flex items-center">
          <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
          Photos ({photos.length})
        </h5>
        <button onClick={onClose} className="btn-ghost p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Upload */}
      <label className="block mb-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isUploading ? 'Upload en cours...' : 'Cliquez pour ajouter une photo'}
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </label>

      {/* Gallery */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map(photo => (
          <div key={photo.id} className="relative group">
            <img
              src={`http://localhost:3001/uploads/${photo.filename}`}
              alt={photo.original_name}
              className="w-full h-24 object-cover rounded"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <p className="text-white text-xs opacity-0 group-hover:opacity-100">
                {new Date(photo.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

# 3. DIAGRAMME DE GANTT
echo -e "${BLUE}📊 Création Diagramme de Gantt...${NC}"

cat > src/components/GanttChart/GanttView.jsx << 'EOF'
import { useMemo } from 'react';
import { useTasks } from '../../contexts/TaskContext';

export function GanttView() {
  const { tasks } = useTasks();

  const ganttData = useMemo(() => {
    const startDates = tasks
      .filter(t => t.start_date)
      .map(t => new Date(t.start_date));
    
    const endDates = tasks
      .filter(t => t.end_date)
      .map(t => new Date(t.end_date));

    const minDate = startDates.length > 0 
      ? new Date(Math.min(...startDates))
      : new Date();
    
    const maxDate = endDates.length > 0
      ? new Date(Math.max(...endDates))
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

    return { minDate, maxDate, totalDays };
  }, [tasks]);

  const getTaskPosition = (task) => {
    if (!task.start_date) return { left: 0, width: 0 };

    const startDate = new Date(task.start_date);
    const endDate = task.end_date ? new Date(task.end_date) : new Date();

    const daysSinceStart = Math.floor((startDate - ganttData.minDate) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)));

    const left = (daysSinceStart / ganttData.totalDays) * 100;
    const width = (duration / ganttData.totalDays) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'termine': return 'bg-green-500';
      case 'en_cours': return 'bg-orange-500';
      case 'en_attente_boss': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold font-montserrat mb-6">
        📊 Planning de Gantt - Orphelinat
      </h3>

      {/* Timeline Header */}
      <div className="mb-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>{ganttData.minDate.toLocaleDateString('fr-FR')}</span>
          <span>Aujourd'hui</span>
          <span>{ganttData.maxDate.toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="space-y-3">
        {tasks.map(task => {
          const position = getTaskPosition(task);
          const statusColor = getStatusColor(task.status);

          return (
            <div key={task.id} className="relative">
              {/* Task Name */}
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium w-48 truncate">
                  {task.phase_name}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {task.progression}%
                </span>
              </div>

              {/* Timeline Bar */}
              <div className="relative h-8 bg-gray-100 rounded">
                {task.start_date && (
                  <div
                    className={`absolute top-0 h-full ${statusColor} rounded flex items-center justify-center text-white text-xs font-medium transition-all`}
                    style={position}
                  >
                    {position.width !== '0%' && (
                      <span className="px-2">{task.progression}%</span>
                    )}
                  </div>
                )}

                {/* Current Date Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                  style={{
                    left: `${((new Date() - ganttData.minDate) / (1000 * 60 * 60 * 24) / ganttData.totalDays) * 100}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
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
        <div className="flex items-center ml-auto">
          <div className="w-0.5 h-4 bg-red-500 mr-2"></div>
          <span>Aujourd'hui</span>
        </div>
      </div>
    </div>
  );
}
EOF

# 4. Mettre à jour App.jsx pour inclure les nouvelles vues
echo -e "${BLUE}🔄 Mise à jour App.jsx...${NC}"

cat > src/App.jsx << 'EOF'
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider, useTasks } from './contexts/TaskContext';
import { LoginModal } from './components/Auth/LoginModal';
import { Header, MobileNav } from './components/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Validations } from './components/Validations/Validations';
import { CostsView } from './components/Dashboard/CostsView';
import { TeamView } from './components/Dashboard/TeamView';
import { BudgetForm } from './components/BudgetManager/BudgetForm';
import { GanttView } from './components/GanttChart/GanttView';
import { LoadingSpinner } from './components/UI';

function AppContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { tasks } = useTasks();
  const [activeTab, setActiveTab] = useState('dashboard');

  const pendingValidations = tasks.filter(t => t.status === 'en_attente_boss').length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bricol-gray-light">
        <LoadingSpinner size="lg" message="Initialisation de Bricol..." />
      </div>
    );
  }

  if (!user) {
    return <LoginModal />;
  }

  return (
    <div className="min-h-screen bg-bricol-gray-light">
      <Header />
      
      {/* Navigation améliorée */}
      <div className="hidden md:block bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
              📊 Dashboard
            </TabButton>
            <TabButton active={activeTab === 'gantt'} onClick={() => setActiveTab('gantt')}>
              📈 Gantt
            </TabButton>
            <TabButton active={activeTab === 'validations'} onClick={() => setActiveTab('validations')}>
              ✅ Validations {pendingValidations > 0 && `(${pendingValidations})`}
            </TabButton>
            {user?.permissions?.canEditBudget && (
              <TabButton active={activeTab === 'budget'} onClick={() => setActiveTab('budget')}>
                💰 Budget
              </TabButton>
            )}
            <TabButton active={activeTab === 'costs'} onClick={() => setActiveTab('costs')}>
              💵 Coûts
            </TabButton>
            <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')}>
              👥 Équipe
            </TabButton>
          </nav>
        </div>
      </div>

      <MobileNav activeTab={activeTab} onChange={setActiveTab} pendingCount={pendingValidations} />

      <main className="min-h-screen">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'gantt' && <GanttView />}
        {activeTab === 'validations' && <Validations />}
        {activeTab === 'budget' && <BudgetForm />}
        {activeTab === 'costs' && <CostsView />}
        {activeTab === 'team' && <TeamView />}
      </main>

      <footer className="hidden md:block bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>Bricol v2.0 - Suivi Chantier Orphelinat "Les Petits Anges de Dieu" © 2025</p>
        </div>
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 border-b-2 transition-colors ${
        active
          ? 'border-bricol-blue text-bricol-blue'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
EOF

# 5. Améliorer le Dashboard pour afficher les sous-tâches
echo -e "${BLUE}📋 Mise à jour Dashboard avec sous-tâches...${NC}"

cat > src/components/Dashboard/PhaseDetail.jsx << 'EOF'
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SubTaskList } from '../SubTasks/SubTaskList';

export function PhaseDetail({ phase }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-gray-200 pt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
      >
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        <span>Voir les sous-tâches</span>
      </button>

      {isExpanded && (
        <div className="mt-4 pl-4 animate-slide-in">
          <SubTaskList phase={phase} />
        </div>
      )}
    </div>
  );
}
EOF

echo ""
echo -e "${GREEN}✅ Toutes les fonctionnalités v2.0 installées !${NC}"
echo ""
echo "🎯 Nouvelles fonctionnalités disponibles :"
echo "  💰 Budget Manager (onglet Budget - Chef uniquement)"
echo "  🔨 Sous-tâches avec photos (dans chaque phase)"
echo "  📊 Diagramme de Gantt (onglet Gantt)"
echo ""
echo "🔄 Redémarrez l'application : npm run dev:all"
echo ""


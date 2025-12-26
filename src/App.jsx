import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider, useTasks } from './contexts/TaskContext';
import { LoginModal } from './components/Auth/LoginModal';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { GanttView } from './components/GanttChart/GanttView';
import { Validations } from './components/Validations/Validations';
import { BudgetForm } from './components/BudgetManager/BudgetForm';
import { CostsView } from './components/Dashboard/CostsView';

function AppContent() {
  const { user } = useAuth();
  const { phases = [] } = useTasks(); // Valeur par défaut
  const [activeTab, setActiveTab] = useState('dashboard');

  // Calculer les phases en attente de validation (avec protection)
  const pendingValidations = Array.isArray(phases) 
    ? phases.filter(p => p.status === 'en_attente_boss').length 
    : 0;

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', show: true },
    { id: 'gantt', label: '📈 Gantt', show: true },
    { 
      id: 'validations', 
      label: `✅ Validations ${pendingValidations > 0 ? `(${pendingValidations})` : ''}`, 
      show: true 
    },
    { id: 'budget', label: '💰 Budget', show: user?.permissions?.canEditBudget },
    { id: 'costs', label: '💵 Coûts', show: true },
  ].filter(t => t.show);

  if (!user) {
    return <LoginModal />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-bricol-blue text-bricol-blue'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'gantt' && <GanttView />}
        {activeTab === 'validations' && <Validations />}
        {activeTab === 'budget' && <BudgetForm />}
        {activeTab === 'costs' && <CostsView />}
      </main>
    </div>
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

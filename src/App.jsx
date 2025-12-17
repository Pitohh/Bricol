import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider, useTasks } from './contexts/TaskContext';
import { LoginModal } from './components/Auth/LoginModal';
import { Header } from './components/Layout';
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

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', show: true },
    { id: 'gantt', label: '📈 Gantt', show: true },
    { id: 'validations', label: `✅ Validations ${pendingValidations > 0 ? `(${pendingValidations})` : ''}`, show: true },
    { id: 'budget', label: '💰 Budget', show: user?.permissions?.canEditBudget },
    { id: 'costs', label: '💵 Coûts', show: true },
    { id: 'team', label: '👥 Équipe', show: true }
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-bricol-gray-light">
      <Header />
      
      {/* Navigation principale - Visible sur tous les écrans */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === item.id
                    ? 'border-bricol-blue text-bricol-blue'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="min-h-screen">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'gantt' && <GanttView />}
        {activeTab === 'validations' && <Validations />}
        {activeTab === 'budget' && <BudgetForm />}
        {activeTab === 'costs' && <CostsView />}
        {activeTab === 'team' && <TeamView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>Bricol v2.0 - Suivi Chantier © 2025</p>
        </div>
      </footer>
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

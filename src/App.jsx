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

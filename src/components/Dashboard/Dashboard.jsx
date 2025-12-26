import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import { GanttChart } from '../GanttChart/GanttChart';
import { PhaseCard } from './PhaseCard';
import { ResetProject } from './ResetProject';

export function Dashboard() {
  const { user } = useAuth();
  const { phases = [], loading, error, fetchPhases } = useTasks();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });

  useEffect(() => {
    fetchPhases();
  }, [fetchPhases]);

  useEffect(() => {
    if (phases && phases.length > 0) {
      setStats({
        total: phases.length,
        completed: phases.filter(p => p.status === 'termine').length,
        inProgress: phases.filter(p => p.status === 'en_cours').length,
        pending: phases.filter(p => p.status === 'a_faire' || p.status === 'en_attente_boss').length
      });
    }
  }, [phases]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bricol-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">❌ Erreur de chargement</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPhases}
            className="px-4 py-2 bg-bricol-blue text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue, <span className="font-semibold">{user?.name}</span> - {user?.role_label}
        </p>
      </div>

      {/* Planning Gantt global */}
      <GanttChart />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Total Phases</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Terminées</div>
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">En cours</div>
          <div className="text-3xl font-bold text-orange-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">En attente</div>
          <div className="text-3xl font-bold text-gray-600">{stats.pending}</div>
        </div>
      </div>

      {/* Bouton Reset - JUSTE AVANT LA LISTE DES PHASES */}
      <ResetProject />

      {/* Liste des phases */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Phases du projet</h2>
        
        {!phases || phases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">Aucune phase trouvée</p>
            <button
              onClick={fetchPhases}
              className="mt-4 px-4 py-2 bg-bricol-blue text-white rounded-lg hover:bg-blue-700"
            >
              Recharger
            </button>
          </div>
        ) : (
          phases.map(phase => (
            <PhaseCard key={phase.id} phase={phase} />
          ))
        )}
      </div>
    </div>
  );
}

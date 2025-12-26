import { useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { phasesApi } from '../../utils/api';

export function Validations() {
  const { user } = useAuth();
  const { phases = [], loading, fetchPhases } = useTasks();

  useEffect(() => {
    fetchPhases();
  }, []);

  const pendingPhases = Array.isArray(phases) 
    ? phases.filter(p => p.status === 'en_attente_boss')
    : [];

  const handleApprove = async (phaseId) => {
    if (!confirm('Approuver cette phase à 100% ?')) return;
    
    try {
      await phasesApi.approve(phaseId);
      alert('✅ Phase approuvée !');
      fetchPhases();
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bricol-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-2">Validations en attente</h2>
        <p className="text-gray-600">
          Phases validées techniquement par le coordinateur, en attente d'approbation finale
        </p>
      </div>

      {pendingPhases.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">✅ Aucune validation en attente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPhases.map(phase => (
            <div key={phase.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {phase.phase_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                      Progression : <span className="font-semibold">85%</span>
                    </span>
                    <span className="text-gray-600">
                      Budget : <span className="font-semibold">
                        {(phase.estimated_cost || 0).toLocaleString('fr-FR')} XOF
                      </span>
                    </span>
                  </div>
                </div>

                {user?.permissions?.canApproveFinal && (
                  <button
                    onClick={() => handleApprove(phase.id)}
                    className="ml-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Approuver 15% finaux
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

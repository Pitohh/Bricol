import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subTasksApi } from '../../utils/api';
import { Plus, CheckCircle, Clock, Image, FileText, Trash2 } from 'lucide-react';
import { SubTaskForm } from './SubTaskForm';
import { PhotoUpload } from './PhotoUpload';

export function SubTaskList({ phase }) {
  const { user } = useAuth();
  const [subTasks, setSubTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
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
      alert('❌ Erreur : ' + error.message);
    }
  };

  const handleValidateSubTask = async (subTaskId) => {
    try {
      await subTasksApi.validate(subTaskId);
      loadSubTasks();
      alert('✅ Sous-tâche validée !');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    }
  };

  const handleDeleteSubTask = async (subTaskId) => {
    if (!confirm('Supprimer cette sous-tâche ?')) return;
    try {
      await subTasksApi.delete(subTaskId);
      loadSubTasks();
      alert('✅ Sous-tâche supprimée !');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  const canManage = user?.permissions?.canEditBudget; // Michael
  const canValidate = user?.permissions?.canValidateTechnically; // Tanguy

  return (
    <div className="space-y-4 pl-4 border-l-2 border-blue-200">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          Sous-tâches ({subTasks.length})
        </h4>
        
        {canManage && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-xs px-3 py-1"
          >
            <Plus className="w-3 h-3 inline mr-1" />
            Ajouter sous-tâche
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
          Aucune sous-tâche. {canManage && 'Cliquez sur "Ajouter sous-tâche" pour commencer.'}
        </p>
      ) : (
        <div className="space-y-3">
          {subTasks.map(subTask => (
            <div key={subTask.id} className="card bg-gray-50 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-medium text-gray-900">{subTask.task_name}</h5>
                    {subTask.status === 'termine' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  {subTask.description && (
                    <p className="text-xs text-gray-600 mt-1">{subTask.description}</p>
                  )}
                </div>
                
                {canManage && subTask.status !== 'termine' && (
                  <button
                    onClick={() => handleDeleteSubTask(subTask.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Progression */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-medium">{subTask.progression || 0}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subTask.progression || 0}
                  onChange={(e) => handleProgressChange(subTask.id, Number(e.target.value))}
                  className="w-full"
                  disabled={subTask.status === 'termine' || !canValidate}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedSubTask(subTask.id === selectedSubTask ? null : subTask.id)}
                  className="btn-ghost text-xs px-2 py-1"
                >
                  <Image className="w-3 h-3 inline mr-1" />
                  Photos & Rapport
                </button>

                {canValidate && subTask.status !== 'termine' && subTask.progression >= 80 && (
                  <button
                    onClick={() => handleValidateSubTask(subTask.id)}
                    className="btn-primary text-xs px-3 py-1"
                  >
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Valider
                  </button>
                )}

                {subTask.status === 'termine' && (
                  <span className="text-xs text-green-600 font-medium">
                    ✅ Validée par {subTask.validated_by === 2 ? 'Tanguy' : 'Admin'}
                  </span>
                )}
              </div>

              {/* Zone Photos & Rapport */}
              {selectedSubTask === subTask.id && (
                <PhotoUpload subTask={subTask} onClose={() => setSelectedSubTask(null)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

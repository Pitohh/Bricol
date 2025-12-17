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

#!/bin/bash

echo "🔨 Ajout du système complet de sous-étapes..."
echo ""

# ============================================
# 1. COMPOSANT PHASEDETAIL - Afficher les sous-tâches
# ============================================
echo "📋 Création PhaseDetail avec sous-tâches..."
cat > src/components/Dashboard/PhaseDetail.jsx << 'EOF'
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SubTaskList } from '../SubTasks/SubTaskList';

export function PhaseDetail({ phase }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span>📋 Gérer les sous-tâches</span>
      </button>

      {isExpanded && (
        <div className="mt-4 animate-slide-in">
          <SubTaskList phase={phase} />
        </div>
      )}
    </div>
  );
}
EOF

# ============================================
# 2. SUBTASKLIST COMPLET - Liste et gestion
# ============================================
echo "🔨 Création SubTaskList complet..."
cat > src/components/SubTasks/SubTaskList.jsx << 'EOF'
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
EOF

# ============================================
# 3. SUBTASKFORM - Formulaire de création
# ============================================
echo "📝 Création SubTaskForm..."
cat > src/components/SubTasks/SubTaskForm.jsx << 'EOF'
import { useState } from 'react';
import { subTasksApi } from '../../utils/api';
import { X, Save } from 'lucide-react';

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
      alert('✅ Sous-tâche créée !');
      onSuccess();
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card border-l-4 border-green-500 animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-sm">Nouvelle sous-tâche</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nom de la sous-tâche *
          </label>
          <input
            type="text"
            value={formData.task_name}
            onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
            className="input text-sm"
            placeholder="Ex: Installation des portes intérieures"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input text-sm"
            rows="2"
            placeholder="Détails de la sous-tâche..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Coût estimé (XOF)
            </label>
            <input
              type="number"
              value={formData.estimated_cost}
              onChange={(e) => setFormData({ ...formData, estimated_cost: Number(e.target.value) })}
              className="input text-sm"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="input text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost text-sm">
            Annuler
          </button>
          <button type="submit" disabled={isSaving} className="btn-primary text-sm">
            <Save className="w-3 h-3 inline mr-1" />
            {isSaving ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
EOF

# ============================================
# 4. PHOTOUPLOAD - Upload photo + rapport
# ============================================
echo "📸 Création PhotoUpload..."
cat > src/components/SubTasks/PhotoUpload.jsx << 'EOF'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { photosApi, reportsApi } from '../../utils/api';
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react';

export function PhotoUpload({ subTask, onClose }) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [report, setReport] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [subTask.id]);

  const loadPhotos = async () => {
    try {
      const data = await photosApi.getBySubTask(subTask.id);
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
      await photosApi.upload(subTask.id, file);
      loadPhotos();
      alert('✅ Photo ajoutée !');
    } catch (error) {
      alert('❌ Erreur upload : ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!report.trim()) {
      alert('⚠️ Le rapport ne peut pas être vide');
      return;
    }

    setIsSavingReport(true);
    try {
      await reportsApi.create({
        sub_task_id: subTask.id,
        report_text: report
      });
      alert('✅ Rapport enregistré !');
      setReport('');
    } catch (error) {
      alert('❌ Erreur : ' + error.message);
    } finally {
      setIsSavingReport(false);
    }
  };

  const canUpload = user?.permissions?.canUploadPhotos || user?.permissions?.canEditBudget;

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-semibold text-sm flex items-center">
          <ImageIcon className="w-4 h-4 mr-2 text-blue-600" />
          Photos et Rapport de Chantier
        </h5>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Photo */}
      {canUpload && (
        <div className="mb-4">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
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
        </div>
      )}

      {/* Galerie Photos */}
      {photos.length > 0 && (
        <div className="mb-4">
          <h6 className="text-xs font-medium text-gray-700 mb-2">
            Photos ({photos.length})
          </h6>
          <div className="grid grid-cols-3 gap-2">
            {photos.map(photo => (
              <div key={photo.id} className="relative group">
                <img
                  src={`http://localhost:3001/uploads/${photo.filename}`}
                  alt={photo.original_name}
                  className="w-full h-20 object-cover rounded border border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center rounded">
                  <p className="text-white text-xs opacity-0 group-hover:opacity-100">
                    {new Date(photo.uploaded_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rapport de Chantier */}
      {canUpload && (
        <div>
          <h6 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            Rapport de Chantier
          </h6>
          <textarea
            value={report}
            onChange={(e) => setReport(e.target.value)}
            className="input text-sm mb-2"
            rows="3"
            placeholder="Décrivez l'avancement, les problèmes rencontrés, les matériaux utilisés..."
          />
          <button
            onClick={handleSaveReport}
            disabled={isSavingReport || !report.trim()}
            className="btn-primary text-sm w-full"
          >
            {isSavingReport ? 'Enregistrement...' : 'Enregistrer le rapport'}
          </button>
        </div>
      )}
    </div>
  );
}
EOF

# ============================================
# 5. METTRE À JOUR L'API
# ============================================
echo "🔧 Mise à jour API avec photos et rapports..."
cat >> src/utils/api.js << 'EOF'

export const photosApi = {
  upload: async (subTaskId, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${API_URL}/api/photos/subtask/${subTaskId}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur upload');
    }
    return response.json();
  },
  getBySubTask: (subTaskId) => api.get(`/api/photos/subtask/${subTaskId}`),
};

export const reportsApi = {
  create: (data) => api.post('/api/reports', data),
  getBySubTask: (subTaskId) => api.get(`/api/reports/subtask/${subTaskId}`),
};
EOF

# ============================================
# 6. METTRE À JOUR DASHBOARD
# ============================================
echo "📊 Mise à jour Dashboard avec PhaseDetail..."
cat > src/components/Dashboard/Dashboard.jsx << 'EOF'
import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, ProgressBar, LoadingSpinner } from '../UI';
import { PhaseDetail } from './PhaseDetail';

export function Dashboard() {
  const { tasks, isLoading, validateTechnically } = useTasks();
  const { user } = useAuth();

  if (isLoading) return <LoadingSpinner message="Chargement..." />;

  const total = tasks.reduce((sum, t) => sum + t.progression, 0) / tasks.length || 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
      
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span>Progression globale</span>
          <span className="text-2xl font-bold text-bricol-blue">{Math.round(total)}%</span>
        </div>
        <ProgressBar value={total} />
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{task.phase_name}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <StatusBadge status={task.status} />
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progression</span>
                <span className="font-medium">{task.progression}%</span>
              </div>
              <ProgressBar value={task.progression} />
            </div>

            {user?.permissions?.canValidateTechnically && 
              task.progression >= 80 && 
              task.progression < 85 && (
                <button 
                  onClick={() => validateTechnically(task.id)} 
                  className="btn-primary text-sm mb-3"
                >
                  Valider 85%
                </button>
              )}

            {/* Sous-tâches */}
            <PhaseDetail phase={task} />
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

# ============================================
# 7. AJOUTER ROUTE DELETE SUBTASK
# ============================================
echo "🔧 Ajout route delete subtask..."
cat >> server/routes/subTasks.js << 'EOF'

// Delete subtask
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    db.prepare('DELETE FROM sub_tasks WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
EOF

echo ""
echo "✅ Système complet de sous-tâches créé !"
echo ""
echo "Fonctionnalités ajoutées :"
echo "  ✅ Michael : Créer/Modifier/Supprimer sous-tâches"
echo "  ✅ Tanguy : Valider sous-tâches + Upload photos + Rapports"
echo "  ✅ Bouton 'Gérer les sous-tâches' dans chaque phase"
echo "  ✅ Upload photos pour documenter l'avancement"
echo "  ✅ Rapports de chantier textuels"
echo ""
echo "🔄 Redémarrez :"
echo "   pkill -f node && sleep 2 && npm run dev:all"
echo ""

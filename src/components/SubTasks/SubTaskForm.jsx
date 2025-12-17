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

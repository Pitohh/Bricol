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

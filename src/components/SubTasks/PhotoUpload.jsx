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

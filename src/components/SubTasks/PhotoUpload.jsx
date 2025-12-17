import { useState, useEffect } from 'react';
import { photosApi } from '../../utils/api';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export function PhotoUpload({ subTaskId, onClose }) {
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [subTaskId]);

  const loadPhotos = async () => {
    try {
      const data = await photosApi.getBySubTask(subTaskId);
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
      await photosApi.upload(subTaskId, file);
      loadPhotos();
    } catch (error) {
      alert('Erreur upload : ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-semibold flex items-center">
          <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
          Photos ({photos.length})
        </h5>
        <button onClick={onClose} className="btn-ghost p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Upload */}
      <label className="block mb-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
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

      {/* Gallery */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map(photo => (
          <div key={photo.id} className="relative group">
            <img
              src={`http://localhost:3001/uploads/${photo.filename}`}
              alt={photo.original_name}
              className="w-full h-24 object-cover rounded"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <p className="text-white text-xs opacity-0 group-hover:opacity-100">
                {new Date(photo.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

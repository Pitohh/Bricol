import { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function ResetProject({ onReset }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();

  // Seulement Michael peut réinitialiser
  if (!user?.permissions?.canEditProject) {
    return null;
  }

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001'
        : 'https://cultural-alikee-open-road-00c3b62c.koyeb.app';

      const response = await fetch(`${API_URL}/api/project/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('bricol_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réinitialisation');
      }

      alert('✅ Projet réinitialisé avec succès !');
      setShowConfirm(false);
      
      // Recharger la page
      window.location.reload();
    } catch (error) {
      console.error('Erreur reset:', error);
      alert('❌ Erreur lors de la réinitialisation');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="mb-6">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Réinitialiser le projet</span>
        </button>
      ) : (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900 mb-1">
                Attention : Action irréversible !
              </h3>
              <p className="text-sm text-red-800 mb-2">
                Cette action va :
              </p>
              <ul className="text-sm text-red-800 list-disc list-inside space-y-1">
                <li>Remettre la progression de toutes les phases à 0%</li>
                <li>Supprimer toutes les sous-tâches</li>
                <li>Supprimer toutes les photos</li>
                <li>Supprimer tous les rapports</li>
                <li>Réinitialiser toutes les validations</li>
              </ul>
              <p className="text-sm text-red-900 font-semibold mt-3">
                ⚠️ Cette action est définitive et ne peut pas être annulée !
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors"
            >
              {isResetting ? 'Réinitialisation...' : 'Oui, réinitialiser'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isResetting}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

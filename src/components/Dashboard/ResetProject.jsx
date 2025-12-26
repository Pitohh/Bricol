import { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function ResetProject({ onReset }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();

  // Seulement Michael (Chef de Projet) peut réinitialiser
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

      alert('✅ Projet réinitialisé avec succès ! Toutes les phases sont remises à 0%.');
      setShowConfirm(false);
      
      // Recharger la page pour afficher les données mises à jour
      window.location.reload();
    } catch (error) {
      console.error('Erreur reset:', error);
      alert('❌ Erreur lors de la réinitialisation : ' + error.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {!showConfirm ? (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Réinitialisation du projet
            </h3>
            <p className="text-sm text-gray-600">
              Remettre toutes les phases à zéro (action irréversible)
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md font-semibold"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Réinitialiser</span>
          </button>
        </div>
      ) : (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-4 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900 text-lg mb-2">
                ⚠️ Attention : Action irréversible !
              </h3>
              <p className="text-sm text-red-800 mb-3">
                Cette action va <strong>définitivement</strong> :
              </p>
              <ul className="text-sm text-red-800 list-disc list-inside space-y-2 mb-4">
                <li>Remettre la <strong>progression de toutes les phases à 0%</strong></li>
                <li>Changer le <strong>statut de toutes les phases</strong> en "À faire"</li>
                <li>Supprimer <strong>toutes les sous-tâches</strong> créées</li>
                <li>Supprimer <strong>toutes les photos</strong> uploadées</li>
                <li>Supprimer <strong>tous les rapports</strong> de chantier</li>
                <li>Réinitialiser <strong>toutes les validations</strong> (Tanguy et Michael)</li>
                <li>Remettre les <strong>coûts réels à 0</strong></li>
              </ul>
              <p className="text-sm text-red-900 font-bold bg-red-100 p-3 rounded border border-red-300">
                🔴 Cette action NE PEUT PAS être annulée ! Toutes les données seront perdues.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 transition-colors text-base"
            >
              {isResetting ? '⏳ Réinitialisation en cours...' : '✓ Oui, réinitialiser définitivement'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isResetting}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold transition-colors text-base"
            >
              ✗ Non, annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

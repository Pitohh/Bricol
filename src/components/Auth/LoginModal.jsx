import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

export function LoginModal() {
  const { login, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(username, password);

    if (!success) {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-bricol-blue to-blue-800 flex items-center justify-center p-4">
      <div className="modal-content max-w-md w-full animate-slide-in">
        {/* Logo et titre */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-bricol-blue to-bricol-green rounded-full mb-4">
            <span className="text-3xl">🏗️</span>
          </div>
          <h1 className="text-3xl font-bold font-montserrat text-gradient mb-2">
            Bricol
          </h1>
          <p className="text-gray-600">Suivi Chantier Orphelinat</p>
          <p className="text-sm text-gray-500 mt-1">Les Petits Anges de Dieu</p>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="label">
              <User className="w-4 h-4 inline mr-1" />
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input"
              placeholder="Ex: michael, tanguy, yassa..."
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="label">
              <Lock className="w-4 h-4 inline mr-1" />
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input"
              placeholder="Entrez votre mot de passe"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Connexion...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <LogIn className="w-5 h-5 mr-2" />
                Se connecter
              </span>
            )}
          </button>
        </form>

        {/* Comptes de test */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">Comptes de test :</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>👔 michael / chantier2025 (Boss)</p>
            <p>📋 tanguy / coordinateur123 (Coordinateur)</p>
            <p>🔨 yassa / menuiserie (Artisan)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

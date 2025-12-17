import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bricol-blue to-blue-800 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/assets/logo-bricol.png" 
            alt="Bricol" 
            className="h-20 w-auto"
          />
        </div>

        <h2 className="text-3xl font-bold font-montserrat text-center mb-2 text-bricol-blue">
          Bricol
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Suivi de Chantier Professionnel
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              placeholder="Entrez votre identifiant"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3 text-base">
            Se connecter
          </button>
        </form>

        {/* Comptes de test */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-3 font-medium">
            Comptes de test :
          </p>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
              <span>👔 Chef de Projet</span>
              <code className="bg-white px-2 py-1 rounded text-xs">michael / chantier2025</code>
            </div>
            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
              <span>📋 Coordinateur</span>
              <code className="bg-white px-2 py-1 rounded text-xs">tanguy / coordinateur123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

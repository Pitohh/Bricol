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
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold font-montserrat text-center mb-6 text-bricol-blue">
          🏗️ Bricol
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">Connexion</button>
        </form>
        <div className="mt-6 text-xs text-gray-600 space-y-1">
          <p>👔 michael / chantier2025</p>
          <p>📋 tanguy / coordinateur123</p>
        </div>
      </div>
    </div>
  );
}

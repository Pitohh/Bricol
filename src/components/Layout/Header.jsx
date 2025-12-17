import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bricol-blue to-bricol-green flex items-center justify-center text-white text-xl">
              🏗️
            </div>
            <div>
              <h1 className="text-lg font-bold font-montserrat text-gray-900">
                Bricol
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">
                Suivi Chantier Orphelinat
              </p>
            </div>
          </div>

          {/* Info utilisateur */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-r ${user.permissions.color} flex items-center justify-center text-white shadow-md`}
              >
                <User className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.roleLabel}</p>
              </div>
            </div>

            {/* Bouton déconnexion */}
            <button
              onClick={logout}
              className="btn-ghost flex items-center space-x-2"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

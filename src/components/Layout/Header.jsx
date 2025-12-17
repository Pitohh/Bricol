import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Titre */}
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/logo-bricol.png" 
              alt="Bricol Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold font-montserrat text-bricol-blue">
                Bricol
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">
                Suivi de Chantier
              </p>
            </div>
          </div>

          {/* User Info + Déconnexion */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.role_label}</p>
            </div>
            
            <button 
              onClick={logout} 
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

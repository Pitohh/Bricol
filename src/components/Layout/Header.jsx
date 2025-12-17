import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold font-montserrat text-bricol-blue">🏗️ Bricol</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">{user?.name}</span>
          <button onClick={logout} className="btn-ghost text-sm">Déconnexion</button>
        </div>
      </div>
    </header>
  );
}

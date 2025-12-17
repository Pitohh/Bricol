import { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'utilisateur depuis le token
  useEffect(() => {
    const token = localStorage.getItem('bricol_token');
    if (token) {
      authApi.getMe()
        .then(userData => {
          userData.permissions = typeof userData.permissions === 'string' 
            ? JSON.parse(userData.permissions) 
            : userData.permissions;
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('bricol_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    setError(null);
    
    try {
      const { token, user: userData } = await authApi.login(username, password);
      
      localStorage.setItem('bricol_token', token);
      
      userData.permissions = typeof userData.permissions === 'string' 
        ? JSON.parse(userData.permissions) 
        : userData.permissions;
      
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('bricol_token');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isBoss: user?.role === 'chef_projet_chantier',
    isCoordinator: user?.role === 'coordinateur_travaux',
    isArtisan: user?.role?.startsWith('artisan_')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

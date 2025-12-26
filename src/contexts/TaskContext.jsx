import { createContext, useContext, useState, useCallback } from 'react';
import { phasesApi } from '../utils/api';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPhases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await phasesApi.getAll();
      console.log('✅ Phases loaded:', data);
      setPhases(data || []); // S'assurer que c'est toujours un tableau
    } catch (err) {
      console.error('❌ Error loading phases:', err);
      setError(err.message);
      setPhases([]); // Fallback tableau vide
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    phases,
    loading,
    error,
    fetchPhases,
    setPhases
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

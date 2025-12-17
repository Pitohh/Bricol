import { useTasks } from '../../contexts/TaskContext';
import { LoadingSpinner, StatusBadge } from '../UI';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export function CostsView() {
  const { tasks, isLoading } = useTasks();

  if (isLoading) {
    return <LoadingSpinner message="Chargement des coûts..." />;
  }

  const stats = calculateCostStats(tasks);

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-2">
          Gestion des Coûts
        </h2>
        <p className="text-gray-600">Suivi budgétaire détaillé du projet</p>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Budget Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.budgetTotal)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Dépensé</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.budgetUtilise)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {stats.percentUtilise}% du budget
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Restant</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.budgetRestant)}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {stats.percentRestant}% disponible
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerte si dépassement */}
      {stats.hasOverbudget && (
        <div className="card mb-6 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Attention</h3>
              <p className="text-sm text-red-700">
                Certaines phases présentent des dépassements budgétaires.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tableau détaillé */}
      <div className="card">
        <h3 className="text-lg font-semibold font-montserrat mb-4">
          Détail par Phase
        </h3>

        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-cell text-left font-semibold text-gray-700">Phase</th>
                <th className="table-cell text-right font-semibold text-gray-700">Budget Estimé</th>
                <th className="table-cell text-right font-semibold text-gray-700">
                  Coût Réel
                </th>
                <th className="table-cell text-center font-semibold text-gray-700">Écart</th>
                <th className="table-cell text-center font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map(task => {
                const actualCost = task.actualCost || 0;
                const estimatedCost = task.estimatedCost;
                const diff = actualCost - estimatedCost;
                const diffPercent =
                  actualCost > 0 ? ((diff / estimatedCost) * 100).toFixed(1) : 0;

                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900">{task.phase}</p>
                        <p className="text-xs text-gray-500 mt-1 hidden md:block">
                          {task.assignedTo.join(', ')}
                        </p>
                      </div>
                    </td>
                    <td className="table-cell text-right font-medium text-gray-900">
                      {formatCurrency(estimatedCost)}
                    </td>
                    <td className="table-cell text-right font-medium">
                      {actualCost > 0 ? (
                        <span className={actualCost > estimatedCost ? 'text-red-600' : 'text-green-600'}>
                          {formatCurrency(actualCost)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="table-cell text-center">
                      {actualCost > 0 ? (
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            diff > 0
                              ? 'bg-red-100 text-red-800'
                              : diff < 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {diff > 0 ? '+' : ''}
                          {diffPercent}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="table-cell text-center">
                      <StatusBadge status={task.statut} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td className="table-cell text-gray-900">Total</td>
                <td className="table-cell text-right text-gray-900">
                  {formatCurrency(stats.budgetTotal)}
                </td>
                <td className="table-cell text-right text-gray-900">
                  {formatCurrency(stats.budgetUtilise)}
                </td>
                <td className="table-cell text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      stats.totalDiff > 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {stats.totalDiff > 0 ? '+' : ''}
                    {stats.totalDiffPercent}%
                  </span>
                </td>
                <td className="table-cell"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function calculateCostStats(tasks) {
  const budgetTotal = tasks.reduce((sum, task) => sum + task.estimatedCost, 0);
  const budgetUtilise = tasks.reduce((sum, task) => sum + (task.actualCost || 0), 0);
  const budgetRestant = budgetTotal - budgetUtilise;
  const percentUtilise = Math.round((budgetUtilise / budgetTotal) * 100);
  const percentRestant = 100 - percentUtilise;
  const hasOverbudget = tasks.some(t => (t.actualCost || 0) > t.estimatedCost);
  const totalDiff = budgetUtilise - budgetTotal;
  const totalDiffPercent = ((totalDiff / budgetTotal) * 100).toFixed(1);

  return {
    budgetTotal,
    budgetUtilise,
    budgetRestant,
    percentUtilise,
    percentRestant,
    hasOverbudget,
    totalDiff,
    totalDiffPercent
  };
}

function formatCurrency(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M XOF`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K XOF`;
  }
  return `${value} XOF`;
}

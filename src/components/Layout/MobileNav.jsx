import { LayoutDashboard, CheckSquare, DollarSign, Users } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'validations', label: 'Validations', icon: CheckSquare },
  { id: 'costs', label: 'Coûts', icon: DollarSign },
  { id: 'team', label: 'Équipe', icon: Users }
];

export function MobileNav({ activeTab, onChange, pendingCount = 0 }) {
  return (
    <>
      {/* Mobile navigation */}
      <nav className="md:hidden nav-mobile safe-area-bottom">
        <div className="flex justify-around items-center py-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showBadge = item.id === 'validations' && pendingCount > 0;

            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={isActive ? 'nav-item-active' : 'nav-item'}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {showBadge && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-bricol-red text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <span className="mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop tabs */}
      <div className="hidden md:block bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showBadge = item.id === 'validations' && pendingCount > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => onChange(item.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    isActive
                      ? 'border-bricol-blue text-bricol-blue'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {showBadge && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-bricol-red text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {pendingCount}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

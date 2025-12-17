import { User, Mail, Shield, Briefcase } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    username: 'michael',
    name: 'Michael',
    role: 'Chef de Projet',
    specialty: 'Gestion de projet et supervision',
    permissions: ['Approbation finale', 'Gestion équipe', 'Vue complète'],
    color: 'from-blue-600 to-indigo-700',
    avatar: '👔'
  },
  {
    username: 'tanguy',
    name: 'Tanguy',
    role: 'Coordinateur Travaux',
    specialty: 'Coordination et validation technique',
    permissions: ['Validation 85%', 'Coordination équipes'],
    color: 'from-green-600 to-emerald-700',
    avatar: '📋'
  },
  {
    username: 'yassa',
    name: 'Yassa',
    role: 'Menuisier',
    specialty: 'Menuiserie Générale',
    permissions: ['Consultation tâches'],
    color: 'from-amber-600 to-orange-700',
    avatar: '🔨'
  },
  {
    username: 'francis',
    name: 'Francis',
    role: 'Électricien',
    specialty: 'Électricité',
    permissions: ['Consultation tâches'],
    color: 'from-yellow-600 to-amber-700',
    avatar: '⚡'
  },
  {
    username: 'borel',
    name: 'Borel',
    role: 'Plombier',
    specialty: 'Plomberie et Sanitaires',
    permissions: ['Consultation tâches'],
    color: 'from-blue-500 to-cyan-600',
    avatar: '🚰'
  },
  {
    username: 'joel',
    name: 'Joël',
    role: 'Vitrier',
    specialty: 'Vitrerie',
    permissions: ['Consultation tâches'],
    color: 'from-sky-600 to-blue-700',
    avatar: '🪟'
  },
  {
    username: 'rodrigue',
    name: 'Rodrigue',
    role: 'Soudeur',
    specialty: 'Soudure et Métallurgie',
    permissions: ['Consultation tâches'],
    color: 'from-gray-600 to-slate-700',
    avatar: '🔥'
  }
];

export function TeamView() {
  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-2">
          Équipe du Projet
        </h2>
        <p className="text-gray-600">Les Petits Anges de Dieu - {TEAM_MEMBERS.length} membres</p>
      </div>

      {/* Grille des membres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEAM_MEMBERS.map(member => (
          <TeamMemberCard key={member.username} member={member} />
        ))}
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-bricol-blue" />
            Rôles et Permissions
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-900">Chef de Projet (Boss)</p>
              <p className="text-gray-600">Approbation finale (15% finaux), gestion complète</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Coordinateur</p>
              <p className="text-gray-600">Validation technique (85%), coordination</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Artisans</p>
              <p className="text-gray-600">Consultation, réactions (likes/dislikes)</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-bricol-green" />
            Workflow de Validation
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-xs">
                1
              </span>
              <span className="text-gray-700">Artisan travaille sur la phase</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xs">
                2
              </span>
              <span className="text-gray-700">Coordinateur valide à 85%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                3
              </span>
              <span className="text-gray-700">Boss approuve les 15% finaux</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <span className="text-gray-700">Phase complétée à 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMemberCard({ member }) {
  return (
    <div className="card-hover animate-slide-in">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center text-white text-3xl flex-shrink-0`}
        >
          {member.avatar}
        </div>

        {/* Informations */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
          <p className="text-sm text-bricol-blue font-medium">{member.role}</p>
          <p className="text-xs text-gray-600 mt-1">{member.specialty}</p>

          {/* Permissions */}
          <div className="mt-3 space-y-1">
            {member.permissions.map((perm, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bricol-green"></div>
                <span className="text-xs text-gray-600">{perm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge de rôle */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center space-x-1 text-gray-500">
            <User className="w-3 h-3" />
            <span>@{member.username}</span>
          </span>
          {(member.role === 'Chef de Projet' || member.role === 'Coordinateur Travaux') && (
            <span className="px-2 py-1 bg-bricol-blue text-white rounded-full font-medium">
              Admin
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import { Shield, Building, Users, User, Clock, DollarSign, FileText, BarChart3 } from 'lucide-react';

const roles = [
  {
    title: 'Main Admin',
    icon: Shield,
    color: 'blue',
    features: [
      'Register and manage companies',
      'Enable/disable company accounts',
      'View platform statistics',
      'Manage admin profile',
      'Monitor system activity',
    ],
  },
  {
    title: 'Company Account',
    icon: Building,
    color: 'cyan',
    features: [
      'Register employees and supervisors',
      'Define salary structures',
      'View attendance records',
      'Generate salary and payslips',
      'Manage company profile',
    ],
  },
  {
    title: 'Supervisor',
    icon: Users,
    color: 'emerald',
    features: [
      'View assigned employees',
      'Mark daily attendance',
      'Update attendance records',
      'View attendance history',
      'Generate reports',
    ],
  },
  {
    title: 'Employee',
    icon: User,
    color: 'orange',
    features: [
      'View personal attendance',
      'View salary and payslips',
      'View documents',
      'Update profile information',
      'Download reports',
    ],
  },
];

const highlights = [
  {
    icon: Clock,
    title: 'Attendance Tracking',
    description: 'Real-time attendance monitoring with detailed history and reporting capabilities.',
  },
  {
    icon: DollarSign,
    title: 'Salary Management',
    description: 'Automated salary calculations and payslip generation with customizable structures.',
  },
  {
    icon: FileText,
    title: 'Document Management',
    description: 'Securely store and manage employee documents with easy access controls.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive insights and reports to make data-driven decisions.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Every Role
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Role-based access control ensures everyone has the right tools and information they need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-${role.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 text-${role.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{role.title}</h3>
                <ul className="space-y-3">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 border border-blue-100">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h3>
            <p className="text-gray-600">
              Comprehensive tools to manage your entire workforce efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <div key={highlight.title} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{highlight.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

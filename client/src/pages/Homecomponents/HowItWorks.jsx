import { UserPlus, Settings, CheckCircle, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your account and set up your company profile in minutes. No technical knowledge required.',
  },
  {
    icon: Settings,
    title: 'Configure',
    description: 'Add employees, supervisors, and customize salary structures to match your business needs.',
  },
  {
    icon: CheckCircle,
    title: 'Track',
    description: 'Start tracking attendance, managing schedules, and monitoring your workforce in real-time.',
  },
  {
    icon: TrendingUp,
    title: 'Grow',
    description: 'Use insights and analytics to optimize operations and scale your business effectively.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Started in Minutes
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our intuitive platform makes workforce management simple and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-cyan-200 to-emerald-200 -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>

                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

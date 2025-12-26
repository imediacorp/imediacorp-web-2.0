/**
 * Values Grid Component
 * Displays core values in a grid layout
 */

export function ValuesGrid() {
  const values = [
    {
      title: 'Tools Serve People',
      description:
        'Technology amplifies human judgment, doesn\'t replace it. AI is your advisor, not your replacement. We build tools that empower people to make better decisions.',
      icon: '🛠️',
      color: 'blue',
    },
    {
      title: 'Scientific Integrity',
      description:
        'Sound science, falsifiability, reproducibility, no hype. Innovation that matters must withstand science. We commit to evidence-based practices and peer review.',
      icon: '🔬',
      color: 'green',
    },
    {
      title: 'Sustainable Innovation',
      description:
        'Profits follow meaningful innovation. We focus on creating genuine value—solving real problems, advancing science, serving people—and profits follow naturally.',
      icon: '🌱',
      color: 'amber',
    },
    {
      title: 'Cooperative Governance',
      description:
        'Shared ownership, balanced decision-making, employee co-ownership. We believe in collaborative governance where all stakeholders have a voice and share in success.',
      icon: '🤝',
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    amber: 'from-amber-50 to-amber-100 border-amber-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {values.map((value) => (
        <div
          key={value.title}
          className={`bg-gradient-to-br ${colorClasses[value.color as keyof typeof colorClasses]} rounded-lg p-6 border-2 hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-start space-x-4">
            <div className="text-4xl flex-shrink-0">{value.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-700">{value.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


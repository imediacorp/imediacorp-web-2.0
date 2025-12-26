/**
 * Governance Card Component
 * Displays governance model information
 */

interface GovernanceCardProps {
  title: string;
  description: string;
  icon: string;
}

export function GovernanceCard({ title, description, icon }: GovernanceCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-center mb-4">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      </div>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}


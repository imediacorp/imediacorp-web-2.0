/**
 * Product Card Component
 * Displays a product/service card with icon, title, description, and CTA
 */

import Link from 'next/link';

interface ProductCardProps {
  name: string;
  description: string;
  icon?: string | React.ReactNode;
  href: string;
  category?: string;
  features?: string[];
  status?: 'production' | 'prototype' | 'coming-soon';
  marketSize?: string;
  className?: string;
}

export function ProductCard({
  name,
  description,
  icon,
  href,
  category,
  features,
  status = 'production',
  marketSize,
  className = '',
}: ProductCardProps) {
  const statusColors = {
    production: 'bg-green-100 text-green-800',
    prototype: 'bg-yellow-100 text-yellow-800',
    'coming-soon': 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    production: 'Production Ready',
    prototype: 'Prototype',
    'coming-soon': 'Coming Soon',
  };

  return (
    <Link
      href={href}
      className={`block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {typeof icon === 'string' ? (
            <div className="text-4xl">{icon}</div>
          ) : (
            icon
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            {category && (
              <span className="text-sm text-gray-500">{category}</span>
            )}
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
      {marketSize && (
        <p className="text-xs text-gray-500 mb-3">
          <span className="font-medium">Market:</span> {marketSize}
        </p>
      )}
      {features && features.length > 0 && (
        <ul className="text-xs text-gray-600 space-y-1 mb-4">
          {features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-medium text-blue-600">Learn more →</span>
      </div>
    </Link>
  );
}


/**
 * Domain Grid Component
 * Displays a grid of domain-specific products
 */

import { ProductCard } from './ProductCard';

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: string;
  status: 'production' | 'prototype' | 'coming-soon';
  marketSize?: string;
  features?: string[];
}

interface DomainGridProps {
  domains: Domain[];
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function DomainGrid({
  domains,
  title = 'CHADD Suite Products',
  description,
  columns = 3,
}: DomainGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {domains.map((domain) => (
            <ProductCard
              key={domain.id}
              name={domain.name}
              description={domain.description}
              icon={domain.icon}
              href={domain.href}
              category={domain.category}
              status={domain.status}
              marketSize={domain.marketSize}
              features={domain.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


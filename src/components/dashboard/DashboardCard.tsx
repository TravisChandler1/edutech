import { ReactNode } from 'react';
import Link from 'next/link';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  description: string;
  className?: string;
  link?: string;
}

export default function DashboardCard({ 
  icon, 
  title, 
  value, 
  description,
  className = '',
  link
}: DashboardCardProps) {
  const content = (
    <div className={`bg-white overflow-hidden shadow rounded-lg h-full ${className}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span className="text-gray-500">{description}</span>
        </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block h-full hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

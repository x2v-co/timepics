/**
 * Engine Selection Card Component
 * Displays Rewind, Refract, or Foresee engine options
 */

'use client';

import { FC } from 'react';
import { Clock, Sparkles, Telescope } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type EngineType = 'rewind' | 'refract' | 'foresee';

interface EngineCardProps {
  engine: EngineType;
  onClick?: () => void;
}

const engineData = {
  rewind: {
    name: 'Rewind Engine',
    chineseName: '回溯引擎',
    icon: Clock,
    description: 'Restore and enhance old photos. Travel to the past.',
    features: ['AI Super-Resolution', 'Photo Animation', 'Era Style Transfer'],
    gradient: 'from-blue-500 to-purple-600',
    glowColor: 'rgba(59, 130, 246, 0.3)',
  },
  refract: {
    name: 'Refract Engine',
    chineseName: '折射引擎',
    icon: Sparkles,
    description: 'Visualize parallel universes and alternate histories.',
    features: ['Historical Reconstruction', 'Face Fusion', 'What-If Scenarios'],
    gradient: 'from-purple-500 to-pink-600',
    glowColor: 'rgba(168, 85, 247, 0.3)',
  },
  foresee: {
    name: 'Foresee Engine',
    chineseName: '预见引擎',
    icon: Telescope,
    description: 'Generate visions of the future and age progression.',
    features: ['Future Visualization', 'Age Progression', 'Trend Prediction'],
    gradient: 'from-indigo-500 to-cyan-600',
    glowColor: 'rgba(99, 102, 241, 0.3)',
  },
};

export const EngineCard: FC<EngineCardProps> = ({ engine, onClick }) => {
  const data = engineData[engine];
  const Icon = data.icon;

  const content = (
    <Card
      className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      style={{
        boxShadow: `0 0 0 rgba(0,0,0,0)`,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 10px 40px ${data.glowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
      }}
    >
      {/* Gradient background overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <CardHeader className="relative z-10">
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${data.gradient} mb-4 w-fit`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <CardTitle className="gradient-text">{data.name}</CardTitle>
        <CardDescription>{data.chineseName}</CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        {/* Description */}
        <p className="text-foreground mb-4">{data.description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {data.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Badge variant="outline" className="mr-2 bg-primary/10 border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-1" />
                {feature}
              </Badge>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
          Try {data.name}
          <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return (
    <Link href={`/generate?engine=${engine}`}>
      {content}
    </Link>
  );
};

/**
 * Engine Selector Tabs
 */
interface EngineSelectorProps {
  selectedEngine: EngineType;
  onEngineChange: (engine: EngineType) => void;
}

export const EngineSelector: FC<EngineSelectorProps> = ({ selectedEngine, onEngineChange }) => {
  const engines: EngineType[] = ['rewind', 'refract', 'foresee'];

  return (
    <div className="flex gap-2 p-1 bg-card rounded-lg border border-card-border">
      {engines.map((engine) => {
        const data = engineData[engine];
        const Icon = data.icon;
        const isActive = selectedEngine === engine;

        return (
          <button
            key={engine}
            onClick={() => onEngineChange(engine)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all
              ${isActive
                ? 'bg-primary text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{data.name}</span>
            <span className="sm:hidden">{data.chineseName}</span>
          </button>
        );
      })}
    </div>
  );
};

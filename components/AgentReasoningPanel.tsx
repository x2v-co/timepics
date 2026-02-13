/**
 * Agent Reasoning Panel
 * Displays Agent's chain-of-thought reasoning for transparency
 */

'use client';

import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, TrendingDown, Zap, Eye } from 'lucide-react';

interface ReasoningStep {
  step: string;
  description: string;
  icon?: 'brain' | 'trend-up' | 'trend-down' | 'zap' | 'eye';
}

interface AgentReasoningPanelProps {
  agentName: string;
  reasoning: string;
  strategyAdjustment?: string;
  confidence?: number;
  engine: string;
  compact?: boolean;
}

export const AgentReasoningPanel: FC<AgentReasoningPanelProps> = ({
  agentName,
  reasoning,
  strategyAdjustment,
  confidence,
  engine,
  compact = false
}) => {
  // Parse reasoning into steps
  const parseReasoning = (text: string): ReasoningStep[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const steps: ReasoningStep[] = [];

    lines.forEach(line => {
      if (line.includes('Analysis:') || line.includes('分析:')) {
        steps.push({
          step: 'Situation Analysis',
          description: line,
          icon: 'eye'
        });
      } else if (line.includes('Strategy:') || line.includes('策略:')) {
        steps.push({
          step: 'Strategy Selection',
          description: line,
          icon: 'brain'
        });
      } else if (line.includes('isLosing') || line.includes('winning')) {
        steps.push({
          step: 'Performance Review',
          description: line,
          icon: line.includes('isLosing') ? 'trend-down' : 'trend-up'
        });
      } else if (line.includes('Engine:')) {
        steps.push({
          step: 'Engine Choice',
          description: line,
          icon: 'zap'
        });
      } else if (line.trim()) {
        steps.push({
          step: '',
          description: line,
          icon: undefined
        });
      }
    });

    return steps;
  };

  const steps = parseReasoning(reasoning);
  const getIconComponent = (icon?: string) => {
    switch (icon) {
      case 'brain': return <Brain className="w-4 h-4" />;
      case 'trend-up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'trend-down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'zap': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'eye': return <Eye className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  const getEngineColor = (engine: string) => {
    switch (engine) {
      case 'rewind': return 'bg-blue-600';
      case 'refract': return 'bg-purple-600';
      case 'foresee': return 'bg-cyan-600';
      default: return 'bg-gray-600';
    }
  };

  if (compact) {
    return (
      <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">{agentName}'s Reasoning</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getEngineColor(engine)} variant="outline">
              {engine}
            </Badge>
            {confidence !== undefined && (
              <Badge variant="outline" className="text-xs">
                {Math.round(confidence * 100)}% confidence
              </Badge>
            )}
          </div>
        </div>
        {strategyAdjustment && (
          <div className="text-xs text-yellow-400 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{strategyAdjustment}</span>
          </div>
        )}
        <p className="text-xs text-gray-400 line-clamp-2">{reasoning}</p>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            {agentName}'s Chain-of-Thought
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getEngineColor(engine)}>
              {engine}
            </Badge>
            {confidence !== undefined && (
              <Badge variant="outline">
                {Math.round(confidence * 100)}% confident
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {strategyAdjustment && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400 font-medium mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Strategy Adjustment</span>
            </div>
            <p className="text-sm text-yellow-300">{strategyAdjustment}</p>
          </div>
        )}

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              {step.icon && (
                <div className="mt-1 flex-shrink-0">
                  {getIconComponent(step.icon)}
                </div>
              )}
              <div className="flex-1">
                {step.step && (
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    {step.step}
                  </p>
                )}
                <p className="text-sm text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 italic">
            All Agent decisions are autonomous and verifiable. This reasoning is generated in real-time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

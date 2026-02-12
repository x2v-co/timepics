/**
 * Generation Form Component
 * Handles user prompt input and generation options
 */

'use client';

import { FC, useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { EngineType } from './EngineCard';
import { getPromptSuggestions } from '@/lib/prompts';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface GenerationFormProps {
  engine: EngineType;
  onGenerate: (params: GenerationParams) => void;
  isGenerating?: boolean;
}

export interface GenerationParams {
  prompt: string;
  era?: string;
  aspectRatio: string;
  quality: 'standard' | 'hd';
}

const eras = {
  rewind: ['1900s', '1920s', '1950s', '1980s', '2000s', 'realistic'],
  refract: ['1900s', '1920s', '1950s', '1980s', '2000s', 'realistic'],
  foresee: ['2050s', 'realistic'],
};

const aspectRatios = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '16:9', label: 'Landscape (16:9)' },
  { value: '9:16', label: 'Portrait (9:16)' },
  { value: '4:3', label: 'Classic (4:3)' },
];

export const GenerationForm: FC<GenerationFormProps> = ({ engine, onGenerate, isGenerating = false }) => {
  const [prompt, setPrompt] = useState('');
  const [era, setEra] = useState<string>(eras[engine][0]);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const suggestions = getPromptSuggestions(engine);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    onGenerate({
      prompt: prompt.trim(),
      era,
      aspectRatio,
      quality,
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prompt Input */}
      <div>
        <Label htmlFor="prompt" className="block text-sm font-medium mb-2">
          Describe your vision
        </Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`e.g., ${suggestions[0]}`}
          className="w-full resize-none"
          rows={4}
          maxLength={1000}
          disabled={isGenerating}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {prompt.length}/1000 characters
          </span>
        </div>
      </div>

      {/* Prompt Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Try these prompts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:border-primary hover:text-primary transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm"
      >
        {showAdvanced ? '▼' : '▶'} Advanced Options
      </Button>

      {/* Advanced Options */}
      {showAdvanced && (
        <Card className="p-4 space-y-4 bg-card border-card-border">
          {/* Era Selection */}
          <div>
            <Label className="block text-sm font-medium mb-2">Era / Style</Label>
            <div className="grid grid-cols-3 gap-2">
              {eras[engine].map((eraOption) => (
                <Button
                  key={eraOption}
                  type="button"
                  variant={era === eraOption ? "default" : "outline"}
                  onClick={() => setEra(eraOption)}
                  disabled={isGenerating}
                  size="sm"
                >
                  {eraOption}
                </Button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <Label htmlFor="aspectRatio" className="block text-sm font-medium mb-2">
              Aspect Ratio
            </Label>
            <select
              id="aspectRatio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={isGenerating}
            >
              {aspectRatios.map((ratio) => (
                <option key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quality */}
          <div>
            <Label className="block text-sm font-medium mb-2">Quality</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={quality === 'standard' ? "default" : "outline"}
                onClick={() => setQuality('standard')}
                disabled={isGenerating}
                size="sm"
              >
                Standard
              </Button>
              <Button
                type="button"
                variant={quality === 'hd' ? "default" : "outline"}
                onClick={() => setQuality('hd')}
                disabled={isGenerating}
                size="sm"
              >
                HD (8K)
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={!prompt.trim() || isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            <span>Generate Image</span>
          </>
        )}
      </Button>
    </form>
  );
};

/**
 * Time Capsule Component
 * Daily mystery capsule that users can unlock with correct keywords
 */

'use client';

import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, Sparkles, Clock } from 'lucide-react';
import Image from 'next/image';

interface TimeCapsule {
  id: string;
  date: string;
  hint: string;
  keywords: string[];
  imageUrl?: string;
  isUnlocked: boolean;
}

// Daily capsule data (in production, this would come from API)
const getDailyCapsule = (): TimeCapsule => {
  const today = new Date().toISOString().split('T')[0];

  // Rotate capsules based on day of year
  const capsules = [
    {
      id: 'capsule-1',
      date: today,
      hint: '1969, the surface, not Armstrong... but...',
      keywords: ['moon', 'lunar', 'aldrin', 'buzz'],
      imageUrl: '/images/moon-landing.jpg',
      isUnlocked: false,
    },
    {
      id: 'capsule-2',
      date: today,
      hint: 'A city that never was, floating in 2077...',
      keywords: ['cyberpunk', 'night city', 'neon', 'future'],
      imageUrl: '/images/cyberpunk-city.jpg',
      isUnlocked: false,
    },
    {
      id: 'capsule-3',
      date: today,
      hint: 'What if dinosaurs never went extinct?',
      keywords: ['dinosaur', 'modern', 'city', 'coexist'],
      imageUrl: '/images/dinosaur.jpg',
      isUnlocked: false,
    },
  ];

  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return capsules[dayOfYear % capsules.length];
};

export const TimeCapsule: FC = () => {
  const [capsule, setCapsule] = useState<TimeCapsule | null>(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const dailyCapsule = getDailyCapsule();

    // Check if already unlocked today
    const stored = localStorage.getItem(`capsule-${dailyCapsule.date}`);
    if (stored) {
      setIsUnlocked(true);
      dailyCapsule.isUnlocked = true;
    }

    setCapsule(dailyCapsule);
  }, []);

  const handleGuess = () => {
    if (!capsule || !guess.trim()) return;

    const normalizedGuess = guess.toLowerCase().trim();
    const isCorrect = capsule.keywords.some(keyword =>
      normalizedGuess.includes(keyword.toLowerCase())
    );

    if (isCorrect) {
      setIsUnlocked(true);
      localStorage.setItem(`capsule-${capsule.date}`, 'true');
      // Trigger confetti or celebration animation
    } else {
      setAttempts(prev => prev + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setGuess('');
  };

  if (!capsule) return null;

  return (
    <Card className={`relative overflow-hidden transition-all duration-500 ${shake ? 'animate-shake' : ''}`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse-glow" />

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <Unlock className="w-6 h-6 text-accent" />
            ) : (
              <Lock className="w-6 h-6 text-primary animate-pulse" />
            )}
            <CardTitle className="gradient-text">
              {isUnlocked ? '🎉 Capsule Unlocked!' : '🔒 Today\'s Time Capsule'}
            </CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Expires in {24 - new Date().getHours()}h
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 mt-2">
          <Sparkles className="w-4 h-4 text-accent" />
          {isUnlocked ? 'You cracked the code!' : 'Decode the hint to reveal the hidden image'}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {!isUnlocked ? (
          <>
            {/* Mystery box visualization */}
            <div className="relative aspect-video bg-gradient-to-br from-card to-background rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden">
              {/* Noise effect */}
              <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiLz48L3N2Zz4=')] animate-pulse" />

              <div className="text-center space-y-4">
                <Lock className="w-16 h-16 mx-auto text-primary animate-pulse" />
                <p className="text-lg font-medium">???</p>
                <p className="text-sm text-muted-foreground px-8">
                  Locked until you solve the puzzle
                </p>
              </div>
            </div>

            {/* Hint */}
            <div className="p-4 bg-card/50 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">💡 Hint:</p>
              <p className="text-foreground italic">"{capsule.hint}"</p>
            </div>

            {/* Guess input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your guess..."
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                className="flex-1"
              />
              <Button onClick={handleGuess} variant="default">
                <Sparkles className="w-4 h-4 mr-2" />
                Unlock
              </Button>
            </div>

            {/* Attempts */}
            {attempts > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                {attempts === 1 ? '🤔 Not quite...' : `💭 ${attempts} attempts so far. Keep trying!`}
              </p>
            )}
          </>
        ) : (
          <>
            {/* Revealed image */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-accent/50 shadow-glow-cta">
              <Image
                src={capsule.imageUrl || ''}
                alt="Unlocked capsule"
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  ✨ Unlocked!
                </Badge>
              </div>
            </div>

            {/* Success message */}
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/30 text-center">
              <p className="text-sm font-medium mb-2">🎊 Congratulations!</p>
              <p className="text-xs text-muted-foreground">
                You've unlocked today's time capsule. Come back tomorrow for a new mystery!
              </p>
            </div>
          </>
        )}
      </CardContent>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </Card>
  );
};

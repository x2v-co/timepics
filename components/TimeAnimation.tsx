/**
 * Time Travel Loading Animation Component
 * Shows animated loading state during image generation
 */

'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';

interface TimeAnimationProps {
  engine?: 'rewind' | 'refract' | 'foresee';
  message?: string;
}

export const TimeAnimation: FC<TimeAnimationProps> = ({
  engine = 'rewind',
  message = 'Traveling through time...'
}) => {
  const colors = {
    rewind: { from: '#3B82F6', to: '#9333EA' },
    refract: { from: '#A855F7', to: '#EC4899' },
    foresee: { from: '#6366F1', to: '#06B6D4' },
  };

  const color = colors[engine];

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      {/* Warp Speed Effect */}
      <div className="relative w-64 h-64">
        {/* Outer rings */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: color.from,
              opacity: 0.2,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 2],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Center portal */}
        <motion.div
          className="absolute inset-0 m-auto w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color.from}, ${color.to})`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Inner glow */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: `radial-gradient(circle, ${color.from}, ${color.to})`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: color.from,
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI) / 4) * 100],
              y: [0, Math.sin((i * Math.PI) / 4) * 100],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Loading Message */}
      <div className="text-center space-y-2">
        <motion.p
          className="text-xl font-medium gradient-text"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {message}
        </motion.p>
        <p className="text-sm text-muted-foreground">
          This may take 15-30 seconds
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Simple Loading Spinner
 */
export const LoadingSpinner: FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
    />
  );
};

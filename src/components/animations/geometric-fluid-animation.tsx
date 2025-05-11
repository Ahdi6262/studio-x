'use client';

import { useEffect, useState } from 'react';

const shapesData = [
  { id: 1, size: 'w-40 h-40 md:w-60 md:h-60 lg:w-72 lg:h-72', color: 'bg-primary/10', animationClass: 'animate-float-1', top: '10%', left: '15%' },
  { id: 2, size: 'w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56', color: 'bg-secondary/10', animationClass: 'animate-float-2', top: '60%', left: '70%' },
  { id: 3, size: 'w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44', color: 'bg-accent/5', animationClass: 'animate-float-3', top: '25%', left: '85%' },
  { id: 4, size: 'w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32', color: 'bg-primary/5', animationClass: 'animate-float-4', top: '75%', left: '5%' },
  { id: 5, size: 'w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64', color: 'bg-secondary/5', animationClass: 'animate-float-1', top: '5%', left: '45%', animationDelay: '3s' },
  { id: 6, size: 'w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48', color: 'bg-accent/10', animationClass: 'animate-float-2', top: '40%', left: '5%', animationDelay: '6s' },
];

export function GeometricFluidAnimation() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10" aria-hidden="true">
      {shapesData.map(shape => (
        <div
          key={shape.id}
          className={`absolute opacity-60 filter blur-xl ${shape.size} ${shape.color} ${shape.animationClass}`}
          style={{
            top: shape.top,
            left: shape.left,
            animationDelay: shape.animationDelay || '0s',
          }}
        />
      ))}
    </div>
  );
}

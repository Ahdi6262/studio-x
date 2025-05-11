'use client';

import type { HTMLAttributes } from 'react';

interface AnimatedTextProps extends HTMLAttributes<HTMLElement> {
  text: string;
  el?: keyof JSX.IntrinsicElements;
  className?: string;
  stagger?: number;
  delay?: number; // Overall delay for the component's animation start
}

export const AnimatedTextWord: React.FC<AnimatedTextProps> = ({
  text,
  el: Wrapper = 'span',
  className,
  stagger = 0.08,
  delay = 0,
  ...rest
}) => {
  const words = text.split(' ');

  return (
    <Wrapper className={className} {...rest}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-visible"> {/* Changed to overflow-visible to prevent clipping if letters have descenders/ascenders */}
          <span
            className="inline-block animate-fadeInUp"
            style={{ animationDelay: `${delay + i * stagger}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>} {/* Explicit space */}
        </span>
      ))}
    </Wrapper>
  );
};

export const AnimatedTextCharacter: React.FC<AnimatedTextProps> = ({
  text,
  el: Wrapper = 'span',
  className,
  stagger = 0.025,
  delay = 0,
  ...rest
}) => {
  const letters = Array.from(text); // Handles unicode characters better than split('')

  return (
    <Wrapper className={className} {...rest}>
      {letters.map((letter, i) => (
        <span key={`${letter}-${i}`} className="inline-block overflow-visible">
          <span
            className="inline-block animate-fadeInUp"
            style={{ animationDelay: `${delay + i * stagger}s` }}
          >
            {letter === ' ' ? '\u00A0' : letter} {/* Preserve spaces */}
          </span>
        </span>
      ))}
    </Wrapper>
  );
};


import React from 'react';

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-in' | 'scale-in' | 'none';
  delay?: number;
  className?: string;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fade-in',
  delay = 0,
  className = '',
}) => {
  let animationClass = '';
  
  switch (animation) {
    case 'fade-in':
      animationClass = 'animate-fade-in';
      break;
    case 'slide-in':
      animationClass = 'animate-slide-in-right';
      break;
    case 'scale-in':
      animationClass = 'animate-scale-in';
      break;
    default:
      animationClass = '';
  }
  
  const delayStyle = delay > 0 ? { animationDelay: `${delay}ms` } : {};
  
  return (
    <div className={`${animationClass} ${className}`} style={delayStyle}>
      {children}
    </div>
  );
};

export default AnimatedContainer;


import React from 'react';

interface LoadingAnimationProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 'medium',
  color = 'primary',
  text
}) => {
  let sizeClass = '';
  
  switch (size) {
    case 'small':
      sizeClass = 'h-4 w-4';
      break;
    case 'large':
      sizeClass = 'h-10 w-10';
      break;
    default:
      sizeClass = 'h-6 w-6';
  }
  
  let colorClass = '';
  switch (color) {
    case 'primary':
      colorClass = 'bg-brand-primary';
      break;
    case 'secondary':
      colorClass = 'bg-brand-secondary';
      break;
    case 'white':
      colorClass = 'bg-white';
      break;
    default:
      colorClass = 'bg-brand-primary';
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex space-x-2">
        <div className={`${sizeClass} rounded-full ${colorClass} loading-dot`}></div>
        <div className={`${sizeClass} rounded-full ${colorClass} loading-dot`}></div>
        <div className={`${sizeClass} rounded-full ${colorClass} loading-dot`}></div>
      </div>
      {text && <p className="mt-3 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingAnimation;

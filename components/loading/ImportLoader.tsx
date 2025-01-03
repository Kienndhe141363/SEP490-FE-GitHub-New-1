import React, { useEffect } from 'react';

interface ImportLoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

const ImportLoader: React.FC<ImportLoaderProps> = ({
  size = 'medium',
  fullScreen = false,
  text = 'Importing file...',
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const innerSizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-28 h-28',
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center min-h-[inherit] space-y-8">
      <div className="relative flex items-center justify-center mb-4">
        <div 
          className={`absolute ${sizeClasses[size]} border-4 rounded-full animate-spin`}
          style={{ 
            borderColor: 'transparent',
            borderTopColor: '#4CAF50',
            animationDuration: '1.5s'
          }}
        />
        <div 
          className={`absolute ${innerSizeClasses[size]} border-4 rounded-full`}
          style={{ 
            borderColor: 'transparent',
            borderBottomColor: '#4CAF50',
            animation: 'spin-counter 1.5s linear infinite'
          }}
        />
      </div>
      {text && (
        <p className="text-black font-medium text-lg">
          {text}
        </p>
      )}
    </div>
  );

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin-counter {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(-360deg);
        }
      }
    `;
    document.head.appendChild(styleSheet);

    // Cleanup function to remove the style when the component unmounts
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen">
      {spinnerContent}
    </div>
  );
};

export default ImportLoader;
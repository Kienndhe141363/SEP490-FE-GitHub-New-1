// import React from 'react';

// interface SpinnerLoaderProps {
//   size?: 'small' | 'medium' | 'large';
//   color?: 'blue' | 'green' | 'red' | 'gray';
//   fullScreen?: boolean;
//   text?: string; // Thêm thuộc tính text
// }

// const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({
//   size = 'medium',
//   color = 'green',
//   fullScreen = false,
//   text = 'Loading...', // Giá trị mặc định cho text
// }) => {
//   // Định nghĩa các class dựa trên props
//   const sizeClasses = {
//     small: 'w-6 h-6',
//     medium: 'w-10 h-10',
//     large: 'w-16 h-16',
//   };

//   const colorClasses = {
//     blue: 'text-blue-500',
//     green: 'text-green-500',
//     red: 'text-red-500',
//     gray: 'text-gray-500',
//   };

//   // Nếu fullScreen, hiển thị spinner chiếm toàn màn hình
//   if (fullScreen) {
//     return (
//       <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 p-4">
//         <div
//           className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-current border-t-transparent rounded-full animate-spin mb-4`}
//         ></div>
//         <p className={`${sizeClasses[size] === 'w-6 h-6' ? 'text-sm' : sizeClasses[size] === 'w-10 h-10' ? 'text-base' : 'text-lg'} text-gray-700 font-medium`}>
//           {text}
//         </p>
//       </div>
//     );
//   }

//   // Spinner mặc định
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div
//         className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-current border-t-transparent rounded-full animate-spin mb-2`}
//       ></div>
//       <p className={`${sizeClasses[size] === 'w-6 h-6' ? 'text-sm' : sizeClasses[size] === 'w-10 h-10' ? 'text-base' : 'text-lg'} text-gray-700 font-medium`}>
//         {text}
//       </p>
//     </div>
//   );
// };

// export default SpinnerLoader;

// import React, { useState, useEffect } from 'react';

// const SpinnerLoader: React.FC = () => {
//   const [text, setText] = useState('Loading');

//   useEffect(() => {
//     const texts = ['Loading', 'Processing', 'Almost There', 'Preparing'];
//     let index = 0;
//     const interval = setInterval(() => {
//       index = (index + 1) % texts.length;
//       setText(texts[index]);
//     }, 1500);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="absolute inset-0 flex items-center justify-center z-50">
//       <div className="bg-white p-4 rounded-lg shadow-lg">
//         <div className="text-2xl font-bold text-green-500 animate-pulse">
//           {text}
//           <span className="animate-bounce inline-block ml-2">...</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpinnerLoader;


//code 3
// import React from 'react';

// interface SpinnerLoaderProps {
//   size?: 'small' | 'medium' | 'large';
//   color?: 'blue' | 'green' | 'red' | 'gray';
//   fullScreen?: boolean;
//   text?: string;
// }

// const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({
//   size = 'medium',
//   color = 'green',
//   fullScreen = false,
//   text = 'Loading...', 
// }) => {
//   // Size and color configurations
//   const sizeClasses = {
//     small: { container: 'w-24 h-24', text: 'text-sm' },
//     medium: 'w-40 h-40',
//     large: 'w-56 h-56', 
//   };

//   const colorMap = {
//     blue: '#3B82F6',
//     green: '#6FBC44',
//     red: '#EF4444',
//     gray: '#6B7280'
//   };

//   // Snail SVG Component
//   const SnailSVG = () => (
//     <svg 
//       xmlns="http://www.w3.org/2000/svg" 
//       viewBox="0 0 200 200" 
//       className={`animate-bounce ${size === 'small' ? 'w-24 h-24' : size === 'medium' ? 'w-40 h-40' : 'w-56 h-56'}`}
//     >
//       {/* Snail Shell */}
//       <path 
//         d="M100 50 Q150 30 170 80 Q190 130 140 150 Q90 170 70 140 Q50 110 100 50Z" 
//         fill={colorMap[color]} 
//         className="origin-center animate-spin-slow"
//       />
      
//       {/* Snail Body */}
//       <path 
//         d="M70 140 Q50 160 40 150 Q30 140 50 130 L100 110 Z" 
//         fill="#8B4513" 
//       />
      
//       {/* Eyes */}
//       <circle cx="160" cy="70" r="5" fill="white" />
//       <circle cx="165" cy="68" r="2" fill="black" />
//     </svg>
//   );

//   // Full Screen Loader
//   if (fullScreen) {
//     return (
//       <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 p-4">
//         <SnailSVG />
//         <p className={`mt-4 ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'} text-gray-700 font-medium`}>
//           {text}
//         </p>
//       </div>
//     );
//   }

//   // Inline Loader
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <SnailSVG />
//       <p className={`mt-2 ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'} text-gray-700 font-medium`}>
//         {text}
//       </p>
//     </div>
//   );
// };

// export default SpinnerLoader;


////code 4
// import React from 'react';

// interface SpinnerLoaderProps {
//   size?: 'small' | 'medium' | 'large';
//   color?: 'blue' | 'green' | 'red' | 'gray';
//   fullScreen?: boolean;
//   text?: string;
// }

// const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({
//   size = 'medium',
//   color = 'blue',
//   fullScreen = false,
//   text = 'Loading...', 
// }) => {
//   const colorMap = {
//     blue: '#3B82F6',
//     green: '#10B981',
//     red: '#EF4444',
//     gray: '#6B7280'
//   };

//   const sizeClasses = {
//     small: 'w-24 h-24',
//     medium: 'w-40 h-40',
//     large: 'w-56 h-56'
//   };

//   const PenguinLoader = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className={sizeClasses[size]}>
//       {/* Penguin Body */}
//       <path 
//         d="M100 120 Q80 100 90 80 Q100 50 130 80 Q140 100 120 120 Z" 
//         fill="black"
//         className="animate-bounce"
//       />
//       {/* Belly */}
//       <path 
//         d="M100 90 Q110 80 120 90 Q130 100 110 100 Z" 
//         fill="white"
//       />
//       {/* Feet */}
//       <path 
//         d="M90 120 L80 140 L100 140 Z" 
//         fill="orange"
//         className="animate-[waddle_1s_infinite]"
//       />
//       <path 
//         d="M110 120 L120 140 L100 140 Z" 
//         fill="orange"
//         className="animate-[waddle_1s_infinite_reverse]"
//       />
//       {/* Eyes */}
//       <circle cx="90" cy="70" r="5" fill="white" stroke="black" />
//       <circle cx="110" cy="70" r="5" fill="white" stroke="black" />
//       <circle cx="92" cy="68" r="2" fill="black" />
//       <circle cx="112" cy="68" r="2" fill="black" />
//     </svg>
//   );

//   if (fullScreen) {
//     return (
//       <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 p-4">
//         <PenguinLoader />
//         <p className={`mt-4 ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'} text-gray-700 font-medium`}>
//           {text}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <PenguinLoader />
//       <p className={`mt-2 ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'} text-gray-700 font-medium`}>
//         {text}
//       </p>
//     </div>
//   );
// };

// export default SpinnerLoader;

// import React, { useState, useEffect } from 'react';

// interface SpinnerLoaderProps {
//   size?: 'small' | 'medium' | 'large';
//   theme?: 'neon' | 'cosmic' | 'cyber' | 'gradient';
//   text?: string;
//   duration?: number;
//   showPercentage?: boolean;
//   onComplete?: () => void;
//   progress?: number; // Add real progress prop
// }

// const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({
//   size = 'medium',
//   theme = 'cosmic',
//   text = 'Loading...',
//   duration = 3000,
//   showPercentage = true,
//   onComplete,
//   progress: externalProgress // Renamed to avoid conflict
// }) => {
//   const [progress, setProgress] = useState(0);

//   // Size configurations
//   const sizeConfig = {
//     small: {
//       outer: 'w-48 h-16',
//       inner: 'h-2',
//       text: 'text-sm',
//       pulse: 'w-20'
//     },
//     medium: {
//       outer: 'w-64 h-20',
//       inner: 'h-3',
//       text: 'text-base',
//       pulse: 'w-24'
//     },
//     large: {
//       outer: 'w-80 h-24',
//       inner: 'h-4',
//       text: 'text-lg',
//       pulse: 'w-32'
//     }
//   };

//   // Theme configurations with advanced effects
//   const themeConfig = {
//     neon: {
//       bg: 'bg-black',
//       progress: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500',
//       glow: 'animate-pulse bg-pink-500',
//       text: 'text-pink-500',
//       shadow: 'shadow-lg shadow-pink-500/50',
//       border: 'border-pink-500/20',
//       bgPattern: 'bg-gradient-to-b from-pink-900/20 to-transparent'
//     },
//     cosmic: {
//       bg: 'bg-slate-900',
//       progress: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
//       glow: 'animate-pulse bg-indigo-500',
//       text: 'text-indigo-400',
//       shadow: 'shadow-lg shadow-indigo-500/50',
//       border: 'border-indigo-500/20',
//       bgPattern: 'bg-gradient-to-b from-indigo-900/20 to-transparent'
//     },
//     cyber: {
//       bg: 'bg-zinc-900',
//       progress: 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500',
//       glow: 'animate-pulse bg-emerald-500',
//       text: 'text-emerald-400',
//       shadow: 'shadow-lg shadow-emerald-500/50',
//       border: 'border-emerald-500/20',
//       bgPattern: 'bg-gradient-to-b from-emerald-900/20 to-transparent'
//     },
//     gradient: {
//       bg: 'bg-gray-900',
//       progress: 'bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500',
//       glow: 'animate-pulse bg-yellow-500',
//       text: 'text-yellow-400',
//       shadow: 'shadow-lg shadow-yellow-500/50',
//       border: 'border-yellow-500/20',
//       bgPattern: 'bg-gradient-to-b from-yellow-900/20 to-transparent'
//     }
//   };

//   useEffect(() => {
//     // If external progress is provided, use it
//     if (typeof externalProgress === 'number') {
//       setProgress(externalProgress);
//       if (externalProgress >= 100) {
//         onComplete?.();
//       }
//       return;
//     }

//     // Otherwise, use the auto-incrementing progress
//     const interval = setInterval(() => {
//       setProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           onComplete?.();
//           return 100;
//         }
//         return Math.min(prev + 1, 100);
//       });
//     }, duration / 100);

//     return () => clearInterval(interval);
//   }, [duration, onComplete, externalProgress]);

//   const ProgressBar = () => (
//     <div className={`
//       ${sizeConfig[size].outer}
//       relative
//       rounded-xl
//       border
//       ${themeConfig[theme].border}
//       ${themeConfig[theme].bg}
//       overflow-hidden
//       p-6
//       ${themeConfig[theme].shadow}
//       backdrop-blur-xl
//     `}>
//       {/* Animated background patterns */}
//       <div className="absolute inset-0 opacity-30">
//         <div className={`
//           absolute inset-0
//           ${themeConfig[theme].bgPattern}
//         `} />
//         <div className="absolute inset-0 bg-grid-white/[0.02]" />
//       </div>

//       {/* Main content container */}
//       <div className="relative flex flex-col gap-3">
//         {/* Text and percentage display */}
//         <div className="flex justify-between items-center">
//           <span className={`
//             font-bold
//             ${sizeConfig[size].text}
//             ${themeConfig[theme].text}
//             tracking-wider
//             uppercase
//           `}>
//             {text}
//           </span>
//           {showPercentage && (
//             <span className={`
//               font-mono
//               ${sizeConfig[size].text}
//               ${themeConfig[theme].text}
//               tabular-nums
//             `}>
//               {Math.round(progress)}%
//             </span>
//           )}
//         </div>

//         {/* Progress bar container */}
//         <div className="relative">
//           {/* Background track */}
//           <div className={`
//             ${sizeConfig[size].inner}
//             rounded-full
//             bg-white/10
//             backdrop-blur-lg
//           `} />

//           {/* Animated progress bar */}
//           <div
//             className={`
//               absolute
//               inset-0
//               origin-left
//               rounded-full
//               ${themeConfig[theme].progress}
//               transition-all
//               duration-300
//               ease-out
//             `}
//             style={{ transform: `scaleX(${progress / 100})` }}
//           >
//             {/* Animated pulse effect */}
//             <div className={`
//               absolute
//               inset-y-0
//               right-0
//               ${sizeConfig[size].pulse}
//               bg-gradient-to-r
//               from-transparent
//               to-white/30
//               animate-[pulse_2s_ease-in-out_infinite]
//               rounded-full
//             `} />
//           </div>

//           {/* Gleam effect */}
//           <div
//             className={`
//               absolute
//               inset-0
//               bg-gradient-to-r
//               from-transparent
//               via-white/20
//               to-transparent
//               animate-[shimmer_2s_linear_infinite]
//               rounded-full
//             `}
//           />
//         </div>
//       </div>
//     </div>
//   );

//   // Always render in fixed position at center of screen
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="transform hover:scale-105 transition-transform duration-300">
//         <ProgressBar />
//       </div>
//     </div>
//   );
// };

// export default SpinnerLoader;

import React, { useEffect } from 'react';

interface SpinnerLoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({
  size = 'medium',
  fullScreen = false,
  text = 'Loading...',
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

export default SpinnerLoader;
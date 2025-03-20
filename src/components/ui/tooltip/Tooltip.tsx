// components/ui/tooltip/Tooltip.tsx
import React, { useState, ReactNode, useRef, useEffect } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const showTooltip = () => {
    setTimeout(() => setIsVisible(true), delay);
  };
  
  const hideTooltip = () => {
    setIsVisible(false);
  };
  
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 8;
          break;
      }
      
      // Adjust for scroll position
      top += window.scrollY;
      left += window.scrollX;
      
      setCoords({ top, left });
    }
  }, [isVisible, position]);
  
  return (
    <div 
      className="inline-block relative" 
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 max-w-xs bg-gray-900 text-white text-xs px-3 py-1.5 rounded shadow-lg"
          style={{ 
            top: `${coords.top}px`, 
            left: `${coords.left}px`,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.2s'
          }}
        >
          {content}
          <div 
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'bottom' ? 'top-[-4px]' : 
              position === 'top' ? 'bottom-[-4px]' : 
              position === 'left' ? 'right-[-4px]' : 
              'left-[-4px]'
            }`}
            style={{
              left: position === 'top' || position === 'bottom' ? 'calc(50% - 4px)' : '',
              top: position === 'left' || position === 'right' ? 'calc(50% - 4px)' : '',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
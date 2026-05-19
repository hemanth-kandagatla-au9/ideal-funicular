import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Tooltip.module.scss';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  children: React.ReactNode;
  className?: string;
  maxWidth?: number;
  copyable?: boolean;
}

interface TooltipCoords {
  top: number;
  left: number;
}

const ARROW_SIZE = 7;
const OFFSET = 4;

function getCoords(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  position: TooltipPosition
): TooltipCoords {
  switch (position) {
    case 'top':
      return {
        top: triggerRect.top + window.scrollY - tooltipRect.height - ARROW_SIZE - OFFSET,
        left: triggerRect.left + window.scrollX + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case 'bottom':
      return {
        top: triggerRect.bottom + window.scrollY + ARROW_SIZE + OFFSET,
        left: triggerRect.left + window.scrollX + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case 'left':
      return {
        top: triggerRect.top + window.scrollY + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left + window.scrollX - tooltipRect.width - ARROW_SIZE - OFFSET,
      };
    case 'right':
      return {
        top: triggerRect.top + window.scrollY + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + window.scrollX + ARROW_SIZE + OFFSET,
      };
  }
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 200,
  children,
  className = '',
  maxWidth = 300,
  copyable = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords>({ top: 0, left: 0 });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback(() => {
    if (!wrapperRef.current || !tooltipRef.current) return;
    const triggerRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setCoords(getCoords(triggerRect, tooltipRect, position));
  }, [position]);

  useEffect(() => {
    if (visible) updatePosition();
  }, [visible, updatePosition]);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  const tooltipEl = ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${styles[position]} ${visible ? styles.visible : ''} ${copyable ? styles.copyable : ''}`}
      role="tooltip"
      style={{ top: coords.top, left: coords.left, maxWidth }}
      onMouseEnter={
        copyable
          ? () => {
              if (timerRef.current) clearTimeout(timerRef.current);
              setVisible(true);
            }
          : undefined
      }
      onMouseLeave={copyable ? hide : undefined}
    >
      {content}
      <span className={styles.arrow} />
    </div>,
    document.body
  );

  return (
    <div
      className={`${styles.tooltipWrapper} ${className}`}
      ref={wrapperRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {tooltipEl}
    </div>
  );
};

export default Tooltip;

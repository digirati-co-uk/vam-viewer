import React, { useEffect } from 'react';
// @ts-ignore
import { withBemClass } from '@canvas-panel/core';
import withLocation from '../withLocation/withLocation';

import './CanvasNavigation.scss';

interface CanvasNavigationProps {
  previousRange: () => void;
  nextRange: () => void;
  canvasList: Array<Object>;
  currentIndex: number;
  goToRange: (arg0: Number) => void;
  bem: string | Object;
  hash: string;
  size: Number;
  addressable: boolean;
  id: string | number;
}

const CanvasNavigation: React.FC<CanvasNavigationProps> = ({
  previousRange,
  nextRange,
  canvasList,
  currentIndex,
  goToRange,
  bem,
  hash,
  addressable = false,
  // @ts-ignore
  size = canvasList ? canvasList.length : size,
}) => {
  const goToSlide = (index: number | string) => {
    if (addressable) {
      document.location.hash = '#?slide=' + index;
    }
  };

  useEffect(() => {
    if (addressable && hash) {
      let slideId = hash.includes('slide') && hash.split('=')[1];
      if (slideId) {
        parseInt(slideId);
      }
      let intSlideId = slideId ? parseInt(slideId) : 0;
      if (
        !hash ||
        !intSlideId ||
        intSlideId < 0 ||
        intSlideId >= canvasList.length
      ) {
        goToSlide(0);
        return;
      } else {
        goToRange(intSlideId);
      }
    }
  }, []);

  useEffect(() => {
    goToSlide(currentIndex);
  }, [currentIndex]);

  return (
    // @ts-ignore
    <div className={bem}>
      <button
        className={bem
          // @ts-ignore
          .element('previous')
          .modifiers({ isFirstPage: currentIndex === 0 })}
        onClick={ev => {
          ev.preventDefault();
          previousRange();
        }}
      >
        <svg viewBox="0 0 100 100" width="20px" height="20px">
          <path fill="none" d="M-1-1h582v402H-1z" />
          <g>
            <path
              d="M70.173 12.294L57.446.174l-47.62 50 47.62 50 12.727-12.122-36.075-37.879z"
              fill="currentColor"
              fillRule="nonzero"
            />
          </g>
        </svg>
      </button>
      <button
        className={bem
          // @ts-ignore
          .element('next')
          .modifiers({ isLastPage: currentIndex === size - 1 })}
        onClick={ev => {
          ev.preventDefault();
          nextRange();
        }}
      >
        <svg viewBox="0 0 100 100" width="20px" height="20px">
          <path fill="none" d="M-1-1h582v402H-1z" />
          <g>
            <path
              d="M20 88.052l12.727 12.121 47.62-50-47.62-50L20 12.294l36.075 37.88z"
              fill="currentColor"
              fillRule="nonzero"
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

const navigation = withBemClass('canvas-navigation')(CanvasNavigation);

export default withLocation(navigation);

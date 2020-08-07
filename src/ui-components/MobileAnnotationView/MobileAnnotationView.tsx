import React, { useState, useEffect } from 'react';
// @ts-ignore
import { AnnotationDetail, withBemClass } from 'canvas-panel-beta';
import AnnotationNavigation from '../AnnotationNavigation/AnnotationNavigation';

import { useSwipeable } from 'react-swipeable';
// this is a hook to listen for swipes

import './MobileAnnotationView.scss';
import { Annotation } from 'manifesto.js';

type Selector = {
  type?: string;
  value?: string;
  x: number;
  y: number;
  width?: number | null;
  height?: number | null;
};

interface MobileAnnotationProps {
  animationFramePadding: number;
  disabled: boolean;
  annotations: Array<{ annotation: Annotation; on: { selector: Selector } }>;
  viewport: any;
  bem: any;
  children: any;
}

const MobileAnnotationView: React.FC<MobileAnnotationProps> = ({
  animationFramePadding = 400,
  disabled,
  annotations,
  viewport,
  bem,
  children,
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    goToAnnotation(current);
  }, [disabled]);

  const handlers = useSwipeable({
    onSwipedLeft: () => onNext(),
    onSwipedRight: () => onPrevious(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const goToAnnotation = (index: number) => {
    if (index === 0) {
      viewport.resetView();
    } else {
      const selector = annotations[index - 1].on.selector;
      if (selector) {
        const { x, y, width, height } = selector;
        viewport.goToRect(
          { x, y, width, height: height ? height * 2 : height },
          animationFramePadding
        );
      }
    }
    setCurrent(index);
  };

  const onPrevious = () => {
    if (current !== 0) goToAnnotation(current - 1);
  };

  const onNext = () => {
    if (current >= annotations.length) return;
    goToAnnotation(current + 1);
  };

  const renderSplash = () => {
    return (
      <div className={bem.element('inner')}>
        {children}
        <button
          className={bem.element('button')}
          onClick={() => goToAnnotation(1)}
        >
          Start
        </button>
      </div>
    );
  };

  const renderAnnotation = (annotation: Annotation, next?: Annotation) => {
    return (
      <div className={bem.element('annotation-panel').modifiers({ disabled })}>
        <AnnotationDetail annotation={annotation} />
        <div className={bem.element('footer')}>
          <AnnotationNavigation
            bem={bem}
            onNext={current >= annotations.length ? null : onNext}
            onPrevious={current <= 0 ? null : onPrevious}
          />
        </div>
        <div className={bem.element('void')}>
          {next ? <AnnotationDetail annotation={next} /> : null}
        </div>
      </div>
    );
  };

  const annotation = current === 0 ? null : annotations[current - 1].annotation;

  const next = annotations[current]
    ? annotations[current].annotation
    : undefined;

  return (
    <div
      className={bem.modifiers({ splash: current === 0, disabled })}
      {...handlers}
    >
      {annotation ? renderAnnotation(annotation, next) : renderSplash()}
    </div>
  );
};

export default withBemClass('mobile-annotation-view')(MobileAnnotationView);

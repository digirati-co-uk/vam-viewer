import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Manifest,
  Fullscreen,
  RangeNavigationProvider,
  withBemClass,
  Responsive,
  // @ts-ignore
} from '@canvas-panel/core';
// import MobileViewer from '../MobileViewer/MobileViewer';
import MobilePageView from '../MobilePageView/MobilePageView';
import TapDetector from '../TapDetector/TapDetector';
import SimpleSlideTransition from '../SimpleSlideTransition/SimpleSlideTransition';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
// @ts-ignore
import Slide from '../Slide/Slide.tsx';
// @ts-ignore
import CanvasNavigation from '../CanvasNavigation/CanvasNavigation.tsx';
import PeekComponent from '../PeekComponent/PeekComponent';

import { Swipeable } from 'react-swipeable';

import './SlideShow.scss';

interface SlideShowProps {
  mobileBreakPoint: number;
  backgroundColor: string;
  addressable: boolean;
  id: number;
  jsonLd: object;
  manifestUri: string;
  renderPanel: () => void;
  bem: any;
}

const SlideShow: React.FC<SlideShowProps> = ({
  mobileBreakPoint = 767,
  backgroundColor = '#000000',
  addressable = false,
  id,
  jsonLd,
  manifestUri,
  renderPanel,
  bem,
}) => {
  const [innerWidth, setInnerWidth] = useState(0);
  const [qualifiesForMobile, setQualifiesForMobile] = useState(false);
  const [isMobileFullScreen, setIsMobileFullScreen] = useState(false);
  const [down, setDown] = useState(false);
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [inFocus, setInFocus] = useState(false);
  let touchDetector: any;
  let viewport: any;

  useLayoutEffect(() => {
    if (viewport && touchDetector) {
      //@ts-ignore
      touchDetector.current = new TapDetector(viewport.viewer.viewer.canvas);
    }
    return () => {
      if (touchDetector && touchDetector.current) {
        //@ts-ignore
        touchDetector.current.unbind();
      }
    };
  });

  useEffect(() => {
    window.addEventListener('resize', () => setInnerWidth(window.innerWidth));
    return () =>
      window.removeEventListener('resize', () =>
        setInnerWidth(window.innerWidth)
      );
  }, []);

  useEffect(() => {
    setQualifiesForMobile(window.innerWidth <= mobileBreakPoint);
  }, [innerWidth, mobileBreakPoint]);

  const nextInRange = (fromHOC: () => void) => {
    fromHOC();
    if (viewport) viewport.viewer.viewer.viewport.applyConstraints(true);
  };

  const previousInRange = (fromHOC: () => void) => {
    fromHOC();
    if (viewport) viewport.viewer.viewer.viewport.applyConstraints(true);
  };

  const onDragStart = () => {
    setDown(true);
  };

  const onDragStop = () => {
    setDown(false);
    setOffset(0);
  };

  const applyOffset = (offsetValue: number) => {
    setOffset(offsetValue);
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onExitFullscreen = () => {
    setIsMobileFullScreen(false);
  };

  const onTap = () => {
    setOpen(!open);
  };

  const setViewport = (viewp: any) => {
    //@ts-ignore
    if (touchDetector) {
      touchDetector.unbind();
    }
    touchDetector = new TapDetector(viewp.viewer.viewer.canvas);
    touchDetector.onTap(onTap);
    viewport = viewp;
  };

  return (
    <div
      className={bem.modifiers({
        isMobile: Responsive.md.phone(),
      })}
      onMouseOver={() => setInFocus(true)}
      onMouseLeave={() => setInFocus(false)}
    >
      <Fullscreen>
        {(
          //@ts-ignore
          { ref, ...fullscreenProps }
        ) => {
          fullscreenProps = qualifiesForMobile
            ? {
                fullscreenEnabled: true,
                isFullscreen: isMobileFullScreen,
                exitFullscreen: () => setIsMobileFullScreen(false),
                goFullscreen: () => setIsMobileFullScreen(true),
              }
            : fullscreenProps;
          return (
            <Manifest url={manifestUri} jsonLd={jsonLd}>
              <RangeNavigationProvider>
                {({ ...rangeProps }) => {
                  const {
                    manifest,
                    canvas,
                    canvasList,
                    currentIndex,
                    previousRange,
                    nextRange,
                    region,
                    goToRange,
                    // getPreviousRange,
                    // getNextRange,
                  } = rangeProps;
                  const size = manifest.getSequenceByIndex(0).getCanvases()
                    .length;

                  return (
                    <>
                      {qualifiesForMobile && isMobileFullScreen ? (
                        <MobilePageView
                          manifest={manifest}
                          previousRange={previousRange}
                          nextRange={nextRange}
                          fullscreenProps={fullscreenProps}
                          exitFullscreen={setIsMobileFullScreen}
                          {...rangeProps}
                        />
                      ) : (
                        <div
                          className={bem
                            .element('inner-frame')
                            .modifiers({ isMobile: qualifiesForMobile })}
                          ref={ref}
                          style={{ background: backgroundColor }}
                        >
                          <Swipeable
                            className={bem
                              .element('inner-frame')
                              .modifiers({ isMobile: qualifiesForMobile })}
                            onSwipedLeft={nextRange}
                            onSwipedRight={previousRange}
                            preventDefaultTouchmoveEvent={true}
                            trackMouse={true}
                          >
                            <SimpleSlideTransition id={currentIndex}>
                              <Slide
                                fullscreenProps={fullscreenProps}
                                behaviors={canvas.__jsonld.behavior || []}
                                manifest={manifest}
                                canvas={canvas}
                                region={region}
                                renderPanel={renderPanel}
                                backgroundColor={backgroundColor}
                                mobile={qualifiesForMobile}
                              />
                            </SimpleSlideTransition>
                            <CanvasNavigation
                              previousRange={previousRange}
                              nextRange={nextRange}
                              canvasList={canvasList}
                              currentIndex={currentIndex}
                              addressable={addressable}
                              goToRange={goToRange}
                              id={id}
                              parentInFocus={inFocus}
                            />
                            <ProgressIndicator
                              currentCanvas={currentIndex}
                              totalCanvases={canvasList.length}
                            />
                          </Swipeable>
                        </div>
                      )}
                    </>
                  );
                }}
              </RangeNavigationProvider>
            </Manifest>
          );
        }}
      </Fullscreen>
    </div>
  );
};

export default withBemClass('slideshow')(SlideShow);

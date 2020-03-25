import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Manifest,
  Fullscreen,
  RangeNavigationProvider,
  withBemClass,
  Responsive,
  // @ts-ignore
} from '@canvas-panel/core';
import MobileViewer from '../MobileViewer/MobileViewer';
import TapDetector from '../TapDetector/TapDetector';
import SimpleSlideTransition from '../SimpleSlideTransition/SimpleSlideTransition';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
import Slide from '../Slide/Slide';
import CanvasNavigation from '../CanvasNavigation/CanvasNavigation';
import PeekComponent from '../PeekComponent/PeekComponent';

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
  const [touchDetector, setTouchDetector] = useState<null | any>(null);
  const [isMobileFullScreen, setIsMobileFullScreen] = useState(false);
  const [down, setDown] = useState(false);
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [inFocus, setInFocus] = useState(false);
  let viewport: any;

  useEffect(() => {
    setTouchDetector(null);
  }, [down, open]);

  useEffect(() => {
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, []);

  useEffect(() => {
    setQualifiesForMobile(innerWidth <= mobileBreakPoint);
  }, [innerWidth, mobileBreakPoint]);

  const setSize = () => {
    setInnerWidth(window.innerWidth);
  };

  const nextInRange = (fromHOC: () => void) => {
    viewport.viewer.viewer.viewport.applyConstraints(true);
    fromHOC();
  };

  const previousInRange = (fromHOC: () => void) => {
    viewport.viewer.viewer.viewport.applyConstraints(true);
    fromHOC();
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

  const setViewport = (view: any) => {
    if (touchDetector && touchDetector !== null) {
      touchDetector.unbind();
    }
    setTouchDetector(new TapDetector(view.viewer.viewer.canvas));
    touchDetector.onTap(onTap);
    viewport = view;
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
                {(rangeProps: any) => {
                  const {
                    manifest,
                    canvas,
                    canvasList,
                    currentIndex,
                    previousRange,
                    nextRange,
                    region,
                    goToRange,
                    getPreviousRange,
                    getNextRange,
                  } = rangeProps;
                  const size = manifest.getSequenceByIndex(0).getCanvases()
                    .length;

                  return (
                    <div
                      className={bem.element('inner-frame')}
                      ref={ref}
                      style={{ background: backgroundColor }}
                    >
                      {qualifiesForMobile && isMobileFullScreen ? (
                        <PeekComponent
                          down={down}
                          customOffset={offset}
                          onNext={() => nextInRange(nextRange)}
                          onPrevious={() => previousInRange(previousRange)}
                          size={size}
                          renderLeft={() => (
                            <MobileViewer
                              manifest={manifest}
                              canvas={getPreviousRange()}
                            />
                          )}
                          renderRight={() => (
                            <MobileViewer
                              manifest={manifest}
                              canvas={getNextRange()}
                            />
                          )}
                          index={currentIndex}
                        >
                          <MobileViewer
                            current
                            setViewport={setViewport}
                            manifest={manifest}
                            canvas={canvas}
                            onDragStart={onDragStart}
                            onDragStop={onDragStop}
                            applyOffset={applyOffset}
                            canvasList={manifest
                              .getSequenceByIndex(0)
                              .getCanvases()}
                            onOpen={onOpen}
                            onClose={onClose}
                            onExitFullscreen={onExitFullscreen}
                            isOpen={open}
                            size={size}
                            index={currentIndex}
                            nextRange={nextRange}
                            previousRange={previousRange}
                            goToRange={goToRange}
                            parentInFocus={inFocus}
                            addressable={addressable}
                            id={id}
                          />
                        </PeekComponent>
                      ) : (
                        <React.Fragment>
                          <SimpleSlideTransition id={currentIndex}>
                            <Slide
                              fullscreenProps={fullscreenProps}
                              behaviors={canvas.__jsonld.behavior || []}
                              manifest={manifest}
                              canvas={canvas}
                              region={region}
                              renderPanel={renderPanel}
                              backgroundColor={backgroundColor}
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
                        </React.Fragment>
                      )}
                      )
                    </div>
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

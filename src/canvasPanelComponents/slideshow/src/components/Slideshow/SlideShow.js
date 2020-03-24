import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Manifest,
  Fullscreen,
  RangeNavigationProvider,
  withBemClass,
  Responsive,
} from '@canvas-panel/core';
import MobilePageView from '../MobilePageView/MobilePageView';
import MobileViewer from '../MobileViewer/MobileViewer';
import TapDetector from '../TapDetector/TapDetector';
import SimpleSlideTransition from '../SimpleSlideTransition/SimpleSlideTransition';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
import Slide from '../Slide/Slide';
import CanvasNavigation from '../CanvasNavigation/CanvasNavigation.tsx';
import PeekComponent from '../PeekComponent/PeekComponent';

import './SlideShow.scss';

class SlideShow extends Component {
  state = {
    isMobileFullScreen: false,
    innerWidth: window.innerWidth,
    rangeProps: {},
    offset: 0,
    inFocus: false,
    down: false,
    open: false,
  };

  static propTypes = {
    manifestUri: PropTypes.string,
    jsonLd: PropTypes.object,
    mobileBreakpoint: PropTypes.number,
    addressable: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    backgroundColor: PropTypes.string,
  };

  static defaultProps = {
    mobileBreakpoint: 767,
    backgroundColor: '#000000',
  };

  touchDetector = null;

  componentDidMount() {
    window.addEventListener('resize', this.setSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSize);
  }

  setSize = () => {
    this.setState({
      innerWidth: window.innerWidth,
    });
  };

  qualifiesForMobile = () => {
    return this.state.innerWidth <= this.props.mobileBreakpoint;
  };

  nextRange = fromHOC => {
    this.viewport.viewer.viewer.viewport.applyConstraints(true);
    fromHOC();
  };

  previousRange = fromHOC => {
    this.viewport.viewer.viewer.viewport.applyConstraints(true);
    fromHOC();
  };

  onDragStart = () => {
    this.setState({ down: true });
  };

  onDragStop = () => {
    this.setState({ down: false, offset: 0 });
  };

  applyOffset = offset => {
    this.setState({ offset });
  };
  onOpen = () => {
    this.setState({ open: true });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  onExitFullscreen = () => {
    this.setState({ isMobileFullScreen: false });
  };

  setViewport = viewport => {
    if (this.touchDetector) {
      this.touchDetector.unbind();
    }
    this.touchDetector = new TapDetector(viewport.viewer.viewer.canvas);
    this.touchDetector.onTap(this.onTap);
    this.viewport = viewport;
  };

  render() {
    const {
      manifestUri,
      jsonLd,
      renderPanel,
      bem,
      backgroundColor,
    } = this.props;
    const { offset, down, open } = this.state;

    return (
      <div
        className={bem.modifiers({
          isMobile: Responsive.md.phone(),
        })}
        onMouseOver={() => this.setState({ inFocus: true })}
        onMouseLeave={() => this.setState({ inFocus: false })}
      >
        <Fullscreen>
          {({ ref, ...fullscreenProps }) => {
            fullscreenProps = this.qualifiesForMobile()
              ? {
                  fullscreenEnabled: true,
                  isFullscreen: this.state.isMobileFullScreen,
                  exitFullscreen: () =>
                    this.setState({ isMobileFullScreen: false }),
                  goFullscreen: () =>
                    this.setState({ isMobileFullScreen: true }),
                }
              : fullscreenProps;
            return (
              <Manifest url={manifestUri} jsonLd={jsonLd}>
                <RangeNavigationProvider>
                  {rangeProps => {
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
                    this.manifest = manifest;
                    this.rangeProps = rangeProps;
                    const size = manifest.getSequenceByIndex(0).getCanvases()
                      .length;

                    return (
                      <div
                        className={bem.element('inner-frame')}
                        ref={ref}
                        style={{ background: backgroundColor }}
                      >
                        {this.qualifiesForMobile() &&
                        this.state.isMobileFullScreen ? (
                          <PeekComponent
                            down={down}
                            customOffset={offset}
                            onNext={() => this.nextRange(nextRange)}
                            onPrevious={() => this.previousRange(previousRange)}
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
                              setViewport={this.setViewport}
                              manifest={manifest}
                              canvas={canvas}
                              onDragStart={this.onDragStart}
                              onDragStop={this.onDragStop}
                              applyOffset={this.applyOffset}
                              canvasList={manifest
                                .getSequenceByIndex(0)
                                .getCanvases()}
                              onOpen={this.onOpen}
                              onClose={this.onClose}
                              onExitFullscreen={this.onExitFullscreen}
                              isOpen={open}
                              size={size}
                              index={currentIndex}
                              nextRange={nextRange}
                              previousRange={previousRange}
                              goToRange={goToRange}
                              parentInFocus={this.state.inFocus}
                              addressable={this.props.addressable}
                              id={this.props.id}
                              canvasList={canvasList}
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
                              addressable={this.props.addressable}
                              goToRange={goToRange}
                              id={this.props.id}
                              parentInFocus={this.state.inFocus}
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
  }
}

export default withBemClass('slideshow')(SlideShow);

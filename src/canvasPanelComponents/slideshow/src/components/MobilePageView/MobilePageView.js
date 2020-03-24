import React, { Component } from 'react';
import {
  Manifest,
  Fullscreen,
  RangeNavigationProvider,
  withBemClass,
  Responsive,
} from '@canvas-panel/core';
import Slide from '../Slide/Slide';
import CanvasDetail from '../CanvasDetail/CanvasDetail';
import './MobilePageView.scss';
import TapDetector from '../TapDetector/TapDetector';
import SimpleSlideTransition from '../SimpleSlideTransition/SimpleSlideTransition';
import MobileViewer from '../MobileViewer/MobileViewer';
import FullscreenButton from '../FullscreenButton/FullscreenButton';
import PeekComponent from '../PeekComponent/PeekComponent';
import CanvasNavigation from '../CanvasNavigation/CanvasNavigation.tsx';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';

import ZoomButtons from '../ZoomButtons/ZoomButtons';

class MobilePageView extends Component {
  state = {
    isFullscreen: false,
    currentCanvas: null,
    offset: 0,
    down: false,
    open: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentIndex !== this.props.currentIndex) {
      this.setState({ offset: 0, open: false });
    }
  }

  onDragStart = () => {
    this.setState({ down: true });
  };
  onDragStop = () => {
    this.setState({ down: false });
  };

  nextRange = () => {
    this.viewport.viewer.viewer.viewport.applyConstraints(true);
    this.props.nextRange();
  };

  previousRange = () => {
    this.viewport.viewer.viewer.viewport.applyConstraints(true);
    this.props.previousRange();
  };

  touchDetector = null;

  setViewport = viewport => {
    if (this.touchDetector) {
      this.touchDetector.unbind();
    }
    this.touchDetector = new TapDetector(viewport.viewer.viewer.canvas);
    this.touchDetector.onTap(this.onTap);
    this.viewport = viewport;
  };

  onTap = () => {
    this.setState(s => ({ open: !s.open }));
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
    this.setState({ isFullscreen: false });
  };

  onEnterFullscreen = canvasIndex => () => {
    this.props.goToRange(canvasIndex);
    this.setState({ isFullscreen: true });
  };

  zoomOut = () => {
    this.viewport.zoomOut();
  };

  zoomIn = () => {
    this.viewport.zoomIn();
  };

  componentDidUpdate(prevProps) {
    // only scroll into view if the active item changed last render
    if (!this.state.isFullscreen) {
      this.ensureActiveItemVisible();
    }
  }

  ensureActiveItemVisible = () => {
    if (this.activeItem) {
      this.activeItem.scrollIntoView();
    }
  };

  setActiveRef = element => {
    this.activeItem = element;
  };

  render() {
    const { isFullscreen, offset, down, open } = this.state;
    const { currentIndex, bem, manifest } = this.props;

    if (isFullscreen) {
      const {
        canvas,
        nextRange,
        previousRange,
        getNextRange,
        getPreviousRange,
        goToRange,
        canvasList,
      } = this.props;

      const size = manifest.getSequenceByIndex(0).getCanvases().length;

      return (
        <PeekComponent
          down={down}
          customOffset={offset}
          onNext={this.nextRange}
          onPrevious={this.previousRange}
          size={size}
          renderLeft={() => (
            <MobileViewer manifest={manifest} canvas={getPreviousRange()} />
          )}
          renderRight={() => (
            <MobileViewer manifest={manifest} canvas={getNextRange()} />
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
            onZoomOut={this.zoomOut}
            canvasList={manifest.getSequenceByIndex(0).getCanvases()}
            onZoomIn={this.zoomIn}
            onOpen={this.onOpen}
            onClose={this.onClose}
            onExitFullscreen={this.onExitFullscreen}
            isOpen={open}
            size={size}
            index={currentIndex}
            nextRange={nextRange}
            previousRange={previousRange}
            goToRange={goToRange}
            parentInFocus={this.props.parentInFocus}
            addressable={this.props.addressable}
            id={this.props.id}
            canvasList={canvasList}
          />
        </PeekComponent>
      );
    }
    const { manifestUri, jsonLd, renderPanel, backgroundColor } = this.props;
    const fullscreenProps = {
      fullscreenEnabled: true,
      isFullscreen: this.state.isFullscreen,
      exitFullscreen: () => this.setState({ isFullscreen: false }),
      goFullscreen: () => this.setState({ isFullscreen: true }),
    };
    return (
      <div
        className={bem.modifiers({
          isMobile: Responsive.md.phone(),
        })}
        onMouseOver={() => this.setState({ inFocus: true })}
        onMouseLeave={() => this.setState({ inFocus: false })}
      >
        <Fullscreen>
          {({ ref }) => (
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
                  } = rangeProps;
                  return (
                    <div
                      className={bem.element('inner-frame')}
                      ref={ref}
                      style={{ background: backgroundColor }}
                    >
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
                          parentInFocus={this.props.parentInFocus}
                        />
                        <ProgressIndicator
                          currentCanvas={currentIndex}
                          totalCanvases={canvasList.length}
                        />
                      </React.Fragment>
                    </div>
                  );
                }}
              </RangeNavigationProvider>
            </Manifest>
          )}
        </Fullscreen>
      </div>
    );
  }

  // return (
  //   <div className={bem}>
  //     {manifest
  //       .getSequenceByIndex(0)
  //       .getCanvases()
  //       .map((canvas, canvasIndex) => (
  //         <CanvasDetail
  //           key={canvas ? canvas.id : canvasIndex}
  //           canvas={canvas}
  //         >
  //           {({ label, body, attributionLabel, attribution }) => (
  //             <div
  //               ref={canvasIndex === currentIndex ? this.setActiveRef : null}
  //               className={bem.element('canvas')}
  //             >
  //               <Slide
  //                 className={bem.element('canvas-image')}
  //                 manifest={manifest}
  //                 canvas={canvas}
  //                 maxHeight={200}
  //                 maxWidth={200}
  //               >
  //                 <FullscreenButton
  //                   fullscreenEnabled={true}
  //                   isFullscreen={isFullscreen}
  //                   goFullscreen={this.onEnterFullscreen(canvasIndex)}
  //                   exitFullscreen={this.onExitFullscreen}
  //                 />
  //                 <div className={bem.element('attribution')}>
  //                   {attributionLabel} {attribution}
  //                 </div>
  //               </Slide>
  //               <div className={bem.element('metadata')}>
  //                 <div className={bem.element('detail')}>
  //                   <h3 className={bem.element('detail-label')}>{label}</h3>
  //                   <p className={bem.element('detail-body')}>{body}</p>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //         </CanvasDetail>
  //       ))}
  //   </div>
  // );
}

export default withBemClass('slideshow')(MobilePageView);

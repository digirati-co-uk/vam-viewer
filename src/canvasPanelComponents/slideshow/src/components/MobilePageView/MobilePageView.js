import React, { Component } from 'react';
import {
  Manifest,
  Fullscreen,
  RangeNavigationProvider,
  withBemClass,
  Responsive,
} from '@canvas-panel/core';
import Slide from '../Slide/Slide.tsx';
import './MobilePageView.scss';
import TapDetector from '../TapDetector/TapDetector';
import SimpleSlideTransition from '../SimpleSlideTransition/SimpleSlideTransition';
import MobileViewer from '../MobileViewer/MobileViewer';
import PeekComponent from '../PeekComponent/PeekComponent';
import CanvasNavigation from '../CanvasNavigation/CanvasNavigation.tsx';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';

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

  onEnterFullscreen = canvasIndex => () => {
    this.props.goToRange(canvasIndex);
    this.setState({ isMobileFullScreen: true });
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

    const { manifestUri, jsonLd, renderPanel, backgroundColor } = this.props;
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
          onExitFullscreen={() => this.props.exitFullscreen(false)}
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
}

export default withBemClass('slideshow')(MobilePageView);

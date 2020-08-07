import React, { Component } from 'react';
import { withBemClass } from 'canvas-panel-beta';
import './MobilePageView.scss';
import TapDetector from '../TapDetector/TapDetector';
import MobileViewer from '../MobileViewer/MobileViewer';
import PeekComponent from '../PeekComponent/PeekComponent';

class MobilePageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCanvas: null,
      offset: 0,
      down: false,
      open: false,
    };
  }
  touchDetector = null;

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentIndex !== this.props.currentIndex) {
      this.setState({ offset: 0, open: false });
    }
  }

  nextRange = () => {
    if (this.viewport) {
      this.viewport.viewer.viewer.viewport.applyConstraints(true);
    }
    this.props.nextRange();
  };

  previousRange = () => {
    if (this.viewport) {
      this.viewport.viewer.viewer.viewport.applyConstraints(true);
    }
    this.props.previousRange();
  };

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

  render() {
    const { offset, down, open, video } = this.state;
    const {
      canvas,
      nextRange,
      previousRange,
      getNextRange,
      getPreviousRange,
      goToRange,
      canvasList,
      currentIndex,
      manifest,
      manifestUri,
      isFullScreen,
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
          <MobileViewer
            manifest={manifest}
            canvas={getPreviousRange()}
            manifestUri={manifestUri}
          />
        )}
        renderRight={() => (
          <MobileViewer
            manifest={manifest}
            canvas={getNextRange()}
            manifestUri={manifestUri}
          />
        )}
        index={currentIndex}
      >
        <MobileViewer
          current
          isFullScreen={isFullScreen}
          setViewport={this.setViewport}
          manifest={manifest}
          canvas={this.props.canvas}
          onDragStart={() => this.setState({ down: true })}
          onDragStop={() => this.setState({ down: false })}
          applyOffset={val => this.setState({ offset: val })}
          onZoomOut={() => this.viewport.zoomOut()}
          canvasList={manifest.getSequenceByIndex(0).getCanvases()}
          onZoomIn={() => this.viewport.zoomIn()}
          onOpen={() => this.setState({ open: true })}
          onClose={() => this.setState({ open: false })}
          onExitFullscreen={() => this.props.exitFullscreen(false)}
          isOpen={open}
          size={size}
          index={currentIndex}
          nextRange={nextRange}
          previousRange={previousRange}
          goToRange={goToRange}
          addressable={this.props.addressable}
          id={this.props.id}
          canvasList={canvasList}
          manifestUri={manifestUri}
        />
      </PeekComponent>
    );
  }
}

export default withBemClass('slideshow')(MobilePageView);

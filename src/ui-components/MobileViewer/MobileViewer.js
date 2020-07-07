import React, { Component } from 'react';
import CanvasDetail from '../CanvasDetail/CanvasDetail';
import {
  withBemClass,
  OpenSeadragonViewport,
  FullPageViewport,
  SingleTileSource,
  CanvasProvider,
} from 'canvas-panel-beta';
import './MobileViewer.scss';
import { InfoButton } from '../Icons/InfoButton';
import { CloseIcon } from '../Icons/CloseIcon';
import CanvasNavigation from '../CanvasNavigation/CanvasNavigation';
import { IFrameYouTube } from '../IFrameYouTube/IFrameYouTube';
import { PatchworkPlugin } from '../../viewers/patch-work-plugin/src/index';
import { PatchworkEmbed } from '../../example-stories/PatchworkEmbed/PatchworkEmbed';

const ExitFullscreenIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="#fff" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

const Attribution = ({ bem, hidden, children }) => (
  <div className={bem.element('attribution').modifiers({ hidden })}>
    {children}
  </div>
);

const ExitFullscreen = ({ bem, hidden, onClick }) => (
  <div
    className={bem.element('exit-fullscreen').modifiers({ hidden })}
    onClick={onClick}
  >
    <ExitFullscreenIcon className={bem.element('exit-fullscreen-icon')} />
    Exit
  </div>
);

const InfoPanel = ({ bem, hidden, onClose, children, label, attribution }) => (
  <div
    className={bem.element('info-panel').modifiers({
      hidden,
    })}
    onClick={onClose}
  >
    <CloseIcon className={bem.element('info-panel-close')} />
    <div className={bem.element('info-panel-attribution')}>{attribution}</div>
    <h2>{label}</h2>
    <p className={bem.element('info-panel-body')}>{children}</p>
  </div>
);

function getEmbeddedAnnotations(canvas) {
  return (canvas.__jsonld.annotations || []).reduce((list, next) => {
    if (next.type === 'AnnotationPage') {
      return (next.items || []).reduce((innerList, annotation) => {
        innerList.push(annotation);
        return innerList;
      }, list);
    }
    if (next.type === 'Annotation') {
      list.push(next);
    }
    return list;
  }, []);
}

function checkIfYouTubeVideo(canvas) {
  let isVideo = false;
  let url = '';
  (canvas.__jsonld.items || []).map(item => {
    (item.items || []).filter(sub => {
      isVideo = sub.body.id.includes('youtube');
      if (isVideo) url = sub.body.id;
    });
  });
  return { url, isVideo };
}

class MobileViewer extends Component {
  static defaultProps = {
    applyOffset: () => null,
    setViewport: () => null,
  };

  state = {
    open: false,
    constrained: false,
    offset: 0,
    inFocus: false,
    video: false,
    videoUri: '',
    annotations: [],
    manifestUri: '',
    hideNav: false,
    embeddedTour: false,
  };

  static getDerivedStateFromProps(props, state) {
    let annotations;
    let video = false;
    let videoUri = '';
    if (props.canvas) {
      annotations = getEmbeddedAnnotations(props.canvas).filter(
        anno => anno.motivation === 'describing'
      );
      const vid = checkIfYouTubeVideo(props.canvas);
      video = vid.isVideo;
      videoUri = vid.url;
    }

    const tour =
      props.canvas &&
      props.canvas.__jsonld &&
      props.canvas.__jsonld.behavior &&
      props.canvas.__jsonld.behavior.includes('embedded-tour');
    return {
      ...state,
      annotations: annotations,
      embeddedTour: tour,
      video,
      videoUri,
    };
  }

  onConstrain = (viewer, x, y) => {
    const stateToUpdate = {};
    if (this.props.applyOffset) {
      this.props.applyOffset(-x);
      stateToUpdate.offset = -x;
    }
    stateToUpdate.constrained = true;
    if (y) {
      this.applyConstraints(viewer, true);
    }
    this.setState(stateToUpdate);
  };

  applyConstraints(viewer, immediately) {
    const bounds = viewer.viewport.getBoundsNoRotate();
    const constrainedBounds = viewer.viewport._applyBoundaryConstraints(bounds);
    constrainedBounds.x = bounds.x;
    if (bounds.y !== constrainedBounds.y) {
      viewer.viewport.fitBounds(constrainedBounds, immediately);
    }
  }

  onDragStart = viewer => {
    if (this.props.onDragStart) {
      this.props.onDragStart();
    }
    this.setState({ dragging: true });
  };

  onDragStop = viewer => {
    if (this.props.onDragStop) {
      this.props.onDragStop();
    }
    this.setState({ dragging: false });

    if (this.props.applyOffset) {
      this.props.applyOffset(0);
    }
    this.setState({ constrained: false });
  };

  render() {
    const { dragging } = this.state;
    const {
      current,
      onDragStart,
      onDragStop,
      onClose,
      onExitFullscreen,
      onOpen,
      isOpen,
      bem,
      nextRange,
      previousRange,
      goToRange,
      canvasList,
      size,
      onZoomIn,
      onZoomOut,
      manifestUri,
      manifest,
      isFullScreen,
      ...props
    } = this.props;

    const { canvas, index } = this.props;
    if (!canvas) {
      return <div />;
    }
    return (
      <CanvasProvider currentCanvas={canvas.id}>
        <CanvasDetail key={canvas.id} canvas={canvas}>
          {({ label, body, attributionLabel, attribution }) => (
            <div className={bem.modifiers({ isFullScreen })}>
              <div className={bem.element('inner')}>
                {this.state.embeddedTour ? (
                  <>
                    <PatchworkEmbed
                      isMobileFullscreen={true}
                      mobileHeight={window.innerHeight}
                      onDragStart={this.onDragStart}
                      onDragStop={this.onDragStop}
                      canvas={canvas}
                      onConstrain={this.onConstrain}
                    />
                    {current ? (
                      <ExitFullscreen
                        bem={bem}
                        onClick={onExitFullscreen}
                        hidden={!current || dragging}
                      />
                    ) : (
                      <React.Fragment />
                    )}
                    {current && !dragging && !isOpen && !this.state.hideNav ? (
                      <div
                        className={bem
                          .element('canvas-navigation')
                          .modifiers({ hidden: !current || dragging })}
                      >
                        <CanvasNavigation
                          previousRange={previousRange}
                          nextRange={nextRange}
                          size={size}
                          currentIndex={index}
                          goToRange={goToRange}
                          canvasList={canvasList}
                        />
                      </div>
                    ) : (
                      <React.Fragment />
                    )}
                  </>
                ) : (
                  <SingleTileSource {...props}>
                    {current ? (
                      <ExitFullscreen
                        bem={bem}
                        onClick={onExitFullscreen}
                        hidden={!current || dragging}
                      />
                    ) : (
                      <React.Fragment />
                    )}
                    {current && (label || attribution) ? (
                      <InfoButton
                        bem={bem}
                        onClick={onOpen}
                        hidden={!current || dragging}
                      />
                    ) : (
                      <React.Fragment />
                    )}
                    {current && !dragging && !isOpen ? (
                      <div
                        className={bem
                          .element('canvas-navigation')
                          .modifiers({ hidden: !current || dragging })}
                      >
                        <CanvasNavigation
                          previousRange={previousRange}
                          nextRange={nextRange}
                          size={size}
                          currentIndex={index}
                          goToRange={goToRange}
                          canvasList={canvasList}
                        />
                      </div>
                    ) : (
                      <React.Fragment />
                    )}
                    {!(this.state.video && this.state.videoUri) ? (
                      <FullPageViewport
                        setRef={this.props.setViewport}
                        position="absolute"
                        interactive={true}
                        style={{ height: '100%' }}
                        osdOptions={{
                          visibilityRatio: 1,
                          constrainDuringPan: false,
                          showNavigator: false,
                          animationTime: 0.3,
                        }}
                        onConstrain={this.onConstrain}
                      >
                        <OpenSeadragonViewport
                          useMaxDimensions={true}
                          interactive={true}
                          onDragStart={this.onDragStart}
                          onDragStop={this.onDragStop}
                          osdOptions={this.osdOptions}
                        />
                      </FullPageViewport>
                    ) : (
                      <></>
                    )}
                    {this.state.video && this.state.videoUri ? (
                      <IFrameYouTube
                        setRef={this.props.setViewport}
                        onDragStart={this.onDragStart}
                        onDragStop={this.onDragStop}
                        url={this.state.videoUri}
                        onConstrain={this.onConstrain}
                      />
                    ) : (
                      <></>
                    )}
                  </SingleTileSource>
                )}
              </div>
              {current && (label || attribution) ? (
                <InfoPanel
                  bem={bem}
                  hidden={dragging === true || !isOpen}
                  onClose={onClose}
                  label={label}
                  attribution={attribution}
                >
                  {body}
                </InfoPanel>
              ) : null}
            </div>
          )}
        </CanvasDetail>
      </CanvasProvider>
    );
  }
}

export default withBemClass('mobile-viewer')(MobileViewer);

import React, { Component } from 'react';
import CanvasDetail from '../CanvasDetail/CanvasDetail';
import {
  withBemClass,
  SingleTileSource,
  OpenSeadragonViewport,
  FullPageViewport,
} from '@canvas-panel/core';
import './MobileViewer.scss';
import { InfoButton } from '../Icons/InfoButton.tsx';
import { CloseIcon } from '../Icons/CloseIcon.tsx';
import CanvasNavigation from '../CanvasNavigation/CanvasNavigation.tsx';

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

class MobileViewer extends Component {
  static defaultProps = {
    applyOffset: () => null,
    setViewport: () => null,
  };

  state = { open: false, constrained: false, offset: 0, inFocus: false };

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
      ...props
    } = this.props;
    const { canvas, index } = this.props;
    if (!canvas) {
      return <div />;
    }

    return (
      <CanvasDetail key={canvas.id} canvas={canvas}>
        {({ label, body, attributionLabel, attribution }) => (
          <div
            className={bem}
            onMouseOver={() => this.setState({ inFocus: true })}
            onMouseLeave={() => this.setState({ inFocus: false })}
          >
            <div className={bem.element('inner')}>
              <SingleTileSource {...props}>
                {current ? (
                  <Attribution bem={bem} hidden={!current || dragging}>
                    {attributionLabel} {attribution}
                  </Attribution>
                ) : (
                  <React.Fragment />
                )}
                {current ? (
                  <ExitFullscreen
                    bem={bem}
                    onClick={onExitFullscreen}
                    hidden={!current || dragging}
                  />
                ) : (
                  <React.Fragment />
                )}
                {current && label ? (
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
                      id={this.props.id}
                      parentInFocus={this.state.inFocus}
                      addressable={this.props.addressable}
                      canvasList={canvasList}
                    />
                  </div>
                ) : (
                  <React.Fragment />
                )}

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
              </SingleTileSource>
            </div>
            {current && label ? (
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
    );
  }
}

export default withBemClass('mobile-viewer')(MobileViewer);

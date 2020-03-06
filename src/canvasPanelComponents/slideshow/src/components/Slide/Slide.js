import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withBemClass } from '@canvas-panel/core';
import SwappableViewer from '../SwappableViewer/SwappableViewer';
import CanvasDetail from '../CanvasDetail/CanvasDetail';
import './Slide.scss';

class Slide extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string,
  };

  static defaultProps = {
    backgroundColor: '#000000',
  };
  render() {
    const {
      bem,
      behaviors,
      manifest,
      canvas,
      region,
      renderPanel,
      fullscreenProps,
      backgroundColor,
    } = this.props;
    return (
      <div
        className={bem.modifiers(
          behaviors.reduce((acc, next) => {
            acc[next] = true;
            return acc;
          }, {})
        )}
        style={{ background: backgroundColor }}
      >
        <SwappableViewer
          fullscreenProps={fullscreenProps}
          isInteractive={fullscreenProps.isFullscreen}
          manifest={manifest}
          canvas={canvas}
          region={region}
        />
        {renderPanel ? (
          renderPanel(this.props)
        ) : (
          <CanvasDetail canvas={canvas}>
            {({ label, body, attributionLabel, attribution }) => (
              <div className={bem.element('overlay')}>
                <div className={bem.element('overlay-content')}>
                  {label ? (
                    <h3 className={bem.element('title')}>{label}</h3>
                  ) : null}
                  {body ? <p className={bem.element('text')}>{body}</p> : null}
                </div>
                <div className={bem.element('overlay-floating')}>
                  <p className={bem.element('required-statement')}>
                    {attributionLabel}
                    {attribution}
                  </p>
                </div>
              </div>
            )}
          </CanvasDetail>
        )}
      </div>
    );
  }
}

export default withBemClass('slide')(Slide);

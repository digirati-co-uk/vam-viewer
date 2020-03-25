import React from 'react';
// @ts-ignore
import { withBemClass } from '@canvas-panel/core';
import SwappableViewer from '../SwappableViewer/SwappableViewer';
import CanvasDetail from '../CanvasDetail/CanvasDetail';
import './Slide.scss';

interface SlideProps {
  bem: any;
  behaviors: any;
  manifest: any;
  canvas: any;
  region: any;
  renderPanel: (args: any) => void;
  fullscreenProps: any;
  backgroundColor: string;
  mobile: boolean;
}

const Slide: React.FC<SlideProps> = ({
  bem,
  behaviors,
  manifest,
  canvas,
  region,
  renderPanel,
  fullscreenProps,
  backgroundColor = '#000000',
  mobile = false,
}) => {
  return (
    <div
      className={bem.modifiers(
        behaviors.reduce((acc: any, next: any) => {
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
        renderPanel({
          bem,
          behaviors,
          manifest,
          canvas,
          region,
          renderPanel,
          fullscreenProps,
          backgroundColor,
        })
      ) : (
        <CanvasDetail canvas={canvas}>
          {(
            // @ts-ignore
            { label, body, attributionLabel, attribution }
          ) =>
            mobile ? (
              <div> blah</div>
            ) : (
              <div
                className={bem
                  .element('overlay')
                  .modifiers({ isMobile: mobile })}
              >
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
            )
          }
        </CanvasDetail>
      )}
    </div>
  );
};
export default withBemClass('slide')(Slide);

import React, { useState } from 'react';
// @ts-ignore
import { withBemClass } from 'canvas-panel-beta';
//@ts-ignore
import SwappableViewer from '../SwappableViewer/SwappableViewer';
import CanvasDetail from '../CanvasDetail/CanvasDetail';
//@ts-ignore
import { InfoButton } from '../Icons/InfoButton';
//@ts-ignore
import { CloseIcon } from '../Icons/CloseIcon';
import './Slide.scss';

interface SlideProps {
  bem: any;
  behaviors: any;
  manifest: any;
  canvas: any;
  region: any;
  renderPanel?: (args: any) => void;
  fullscreenProps: any;
  backgroundColor: string;
  mobile: boolean;
  manifestUri: string;
}

interface InfoPanelProps {
  children: any;
  label: string;
  attribution: string;
  bem: any;
  onClose: () => void;
}
const InfoPanel: React.FC<InfoPanelProps> = ({
  children,
  label,
  attribution,
  bem,
  onClose,
}) => (
  <div className={bem.element('info-panel')} onClick={onClose}>
    <CloseIcon className={bem.element('info-panel-close')} />
    <div className={bem.element('info-panel-attribution')}>{attribution}</div>
    <h2>{label}</h2>
    <p className={bem.element('info-panel-body')}>{children}</p>
  </div>
);

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
  manifestUri,
}) => {
  const [open, setOpen] = useState(false);

  const renderInfoPanel = (label: any, attribution: any, body: any) => (
    <InfoPanel
      bem={bem}
      onClose={() => setOpen(false)}
      label={label}
      attribution={attribution}
    >
      {body}
    </InfoPanel>
  );
  return (
    <div
      className={bem.modifiers(
        behaviors.filter((b:any) => b !== 'embedded-tour').reduce((acc: any, next: any) => {
          acc[next] = true;
          return acc;
        }, {})
      )}
      style={{ background: backgroundColor }}
    >
      <SwappableViewer
        fullscreenProps={fullscreenProps}
        isInteractive={true}
        manifest={manifest}
        canvas={canvas}
        region={region}
        manifestUri={manifestUri}
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
          ) => {
            return (
              mobile ? (
                <>
                  {open ? renderInfoPanel(label, attribution, body) : <></>}
                  <InfoButton bem={bem} onClick={setOpen} />
                </>
              ) : (
                <div
                  className={bem
                    .element('overlay')
                    .modifiers({ isMobile: mobile })}
                >
                  {
                    (label || body) &&
                    (<div className={bem.element('overlay-content')}>
                      {label ? (
                        <h3 className={bem.element('title')}>{label}</h3>
                      ) : null}
                      {body ? <p className={bem.element('text')}>{body}</p> : null}
                    </div>)
                  }
                  <div className={bem.element('overlay-floating')}>
                    <p className={bem.element('required-statement')}>
                      {attributionLabel}
                      {attribution}
                    </p>
                  </div>
                </div>
              )
            )

          }}
        </CanvasDetail>
      )}
    </div>
  );
};
export default withBemClass('slide')(Slide);

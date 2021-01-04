import React, { useState, useEffect, useRef } from 'react';
import {
  FullPageViewport,
  withBemClass,
  OpenSeadragonViewport,
  parseSelectorTarget,
  SingleTileSource,
} from 'canvas-panel-beta';
import './SwappableViewer.scss';
import ZoomButtons from '../ZoomButtons/ZoomButtons';
import FullscreenButton from '../FullscreenButton/FullscreenButton';
import { YoutubeVideoSource } from '../YoutubeVideoSource/YoutubeVideoSource';
import { PatchworkEmbed } from '../../example-stories/PatchworkEmbed/PatchworkEmbed';

function getEmbeddedAnnotations(canvas: any) {
  return (canvas.__jsonld.annotations || []).reduce((list: any, next: any) => {
    if (next.type === 'AnnotationPage') {
      return (next.items || []).reduce((innerList: any, annotation: any) => {
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
// @ts-ignore
function createRegionFromAnnotations(canvas: any) {
  const viewportFocuses = getEmbeddedAnnotations(canvas).filter(
    (annotation: any) => annotation.motivation === 'layout-viewport-focus'
  );
  if (viewportFocuses.length > 0) {
    return parseSelectorTarget(
      viewportFocuses[0].target || viewportFocuses[0].on
    );
  }
  return null;
}

interface SwappableViewerProps {
  canvas: any;
  manifest: any;
  isInteractive: boolean;
  fullscreenProps: {
    isFullscreen: boolean;
    isFullscreenEnabled: boolean;
    exitFullscreen: () => void;
    goFullscreen: () => void;
  };
  region: any;
  bem: any;
  manifestUri: string;
}

const SwappableViewer: React.FC<SwappableViewerProps> = ({
  isInteractive = false,
  canvas,
  manifest,
  fullscreenProps,
  region,
  bem,
  manifestUri,
  ...props
}) => {
  const [regionFromAnnotations, setRegionFromAnnotations] = useState<any>();
  const [isZoomedOut, setIsZoomedOut] = useState(true);
  const [isZoomedIn, setIsZoomedIn] = useState(true);
  const [embeddedTour, setEmbeddedTour] = useState(false);
  const [viewport, _setViewport] = useState<any>();

  const osdOptions = {
    visibilityRatio: 1,
    constrainDuringPan: true,
    showNavigator: false,
    immediateRender: false,
    animationTime: 0.5,
    blendTime: 0.3,
    preload: true,
  };

  useEffect(() => {
    if (region) {
      if (viewport) {
        viewport.goToRect(region, 0, 0.0000001);
      }
    } else {
      const _region = createRegionFromAnnotations(canvas);
      if (_region) {
        setRegionFromAnnotations(_region);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, region, viewport]);

  useEffect(() => {
    const describers = getEmbeddedAnnotations(canvas).filter(
      (object: any) => object.motivation === 'describing'
    );

    setEmbeddedTour(
      (canvas &&
        canvas.__jsonld &&
        canvas.__jsonld.behavior &&
        canvas.__jsonld.behavior.includes('embedded-tour')) ||
        describers.length > 1
    );
  }, [canvas]);

  const setViewport = (view: any) => {
    _setViewport(view);
    if (view && (region || regionFromAnnotations)) {
      view.goToRect(region || regionFromAnnotations, 0, 0);
    }
  };

  const zoomOut = () => {
    viewport.zoomOut();
  };

  const zoomIn = () => {
    viewport.zoomIn();
  };

  const updateViewport = (viewer: any) => {
    // const newIsZoomedIn = viewport.getMaxZoom() <= viewport.getZoom();
    // if (newIsZoomedIn !== isZoomedIn) {
    //   setIsZoomedIn(newIsZoomedIn);
    // }
    // const newIsZoomedOut = viewport.getMinZoom() >= viewport.getZoom();
    // if (newIsZoomedOut !== isZoomedOut) {
    //   if (!isZoomedOut && !regionFromAnnotations) {
    //     viewport.resetView();
    //   }
    //   setIsZoomedOut(newIsZoomedOut);
    // }
  };

  const describers = getEmbeddedAnnotations(canvas).filter(
    (object: any) => object.motivation === 'describing'
  );

  return (
    <>
      <div
        className={bem
          .element('viewport')
          .modifiers({ interactive: isInteractive || !isZoomedOut })}
      >
        <FullscreenButton {...fullscreenProps} />
        {embeddedTour ? (
          <>
            <PatchworkEmbed canvas={canvas} fitContainer={true} {...props} />
          </>
        ) : (
          <>
            <YoutubeVideoSource />
            <SingleTileSource
              // @ts-ignore
              manifest={manifest}
              canvas={canvas}
            >
              <FullPageViewport
                onUpdateViewport={updateViewport}
                setRef={setViewport}
                position="absolute"
                interactive={isInteractive || !isZoomedOut}
              >
                {isInteractive ? (
                  <ZoomButtons onZoomOut={zoomOut} onZoomIn={zoomIn} />
                ) : (
                  <></>
                )}
                <OpenSeadragonViewport
                  useMaxDimensions={true}
                  interactive={isInteractive}
                  osdOptions={osdOptions}
                  initialBounds={region || regionFromAnnotations}
                />
              </FullPageViewport>
            </SingleTileSource>
          </>
        )}
      </div>
    </>
  );
};

export default withBemClass('slide')(SwappableViewer);

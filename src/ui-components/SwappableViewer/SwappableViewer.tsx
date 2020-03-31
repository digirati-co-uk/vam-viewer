import React, { useState, useEffect } from 'react';

import {
  FullPageViewport,
  withBemClass,
  OpenSeadragonViewport,
  parseSelectorTarget,
  SingleTileSource,
  // @ts-ignore
} from 'canvas-panel-beta/lib/legacy';

import './SwappableViewer.scss';
import ZoomButtons from '../ZoomButtons/ZoomButtons';
import FullscreenButton from '../FullscreenButton/FullscreenButton';
import { PatchworkPlugin } from '../../viewers/patch-work-plugin/src/index';
//@ts-ignore
import { YoutubeVideoSource } from '../YoutubeVideoSource/YoutubeVideoSource';

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
}) => {
  const [regionFromAnnotations, setRegionFromAnnotations] = useState<any>();
  const [isZoomedOut, setIsZoomedOut] = useState(true);
  const [embeddedTour, setEmbeddedTour] = useState(false);
  let viewport: any;

  const osdOptions = {
    visibilityRatio: 1,
    constrainDuringPan: true,
    showNavigator: false,
    immediateRender: false,
    preload: true,
  };

  useEffect(() => {
    if (region) {
      viewport.goToRect(region, 0, 0.0000001);
    } else {
      const _region = createRegionFromAnnotations(canvas);
      if (_region) {
        setRegionFromAnnotations(_region);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, region]);

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
    viewport = view;
    if (viewport && (region || regionFromAnnotations)) {
      viewport.goToRect(region || regionFromAnnotations, 0, 0);
    }
  };

  const isZoomedIn = () => {
    if (viewport) {
      return viewport.getMaxZoom() <= viewport.getZoom();
    }
    return true;
  };

  const determineIsZoomedOut = () => {
    if (viewport) {
      return viewport.getMinZoom() >= viewport.getZoom();
    }
    return true;
  };

  const zoomOut = () => {
    viewport.zoomOut();
  };

  const zoomIn = () => {
    viewport.zoomIn();
  };

  const updateViewport = (isZoomOut: any) => {
    if (isZoomedOut === false && isZoomOut) {
      viewport.resetView();
    }
    setIsZoomedOut(isZoomedOut);
  };

  return (
    <div
      className={bem
        .element('viewport')
        .modifiers({ interactive: isInteractive || !isZoomedOut })}
    >
      {embeddedTour ? (
        <>
          <FullscreenButton {...fullscreenProps} />
          <PatchworkPlugin
            manifest={manifestUri}
            cssClassMap={{
              annotation: 'annotation-pin',
            }}
            canvas={canvas.index}
            cssClassPrefix="patchwork-"
            fitContainer={true}
            allowFullScreen={false}
            hideSlideShowNav={() => {}}
          />
        </>
      ) : (
        <>
          <YoutubeVideoSource />
          <SingleTileSource canvas={canvas}>
            <FullscreenButton {...fullscreenProps} />
            {isInteractive ? (
              <ZoomButtons
                onZoomOut={determineIsZoomedOut() ? null : zoomOut}
                onZoomIn={isZoomedIn() ? null : zoomIn}
              />
            ) : (
              <></>
            )}
            <FullPageViewport
              onUpdateViewport={updateViewport}
              setRef={setViewport}
              position="absolute"
              interactive={isInteractive || !isZoomedOut}
            >
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
  );
};

export default withBemClass('slide')(SwappableViewer);

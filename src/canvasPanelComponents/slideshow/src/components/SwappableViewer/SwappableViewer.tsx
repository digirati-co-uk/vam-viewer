import React, { useState, useEffect } from 'react';

import {
  FullPageViewport,
  SingleTileSource,
  withBemClass,
  OpenSeadragonViewport,
  parseSelectorTarget,
  // @ts-ignore
} from '@canvas-panel/core';

import './SwappableViewer.scss';
import ZoomButtons from '../ZoomButtons/ZoomButtons';
import FullscreenButton from '../FullscreenButton/FullscreenButton';

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
}

const SwappableViewer: React.FC<SwappableViewerProps> = ({
  isInteractive = false,
  canvas,
  manifest,
  fullscreenProps,
  region,
  bem,
}) => {
  const [regionFromAnnotations, setRegionFromAnnotations] = useState<any>();
  const [itemWidth, setItemWidth] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const [isZoomedOut, setIsZoomedOut] = useState(true);
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

  const setViewport = (view: any) => {
    viewport = view;
    if (viewport && region) {
      viewport.goToRect(region, 0, 0);
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
    if (isZoomOut === false && isZoomOut) {
      viewport.resetView();
    }
    setIsZoomedOut(isZoomOut);
  };

  return (
    <div
      className={bem
        .element('viewport')
        .modifiers({ interactive: isInteractive || !isZoomedOut })}
    >
      <SingleTileSource manifest={manifest} canvas={canvas}>
        <FullscreenButton {...fullscreenProps} />
        <ZoomButtons
          onZoomOut={determineIsZoomedOut() ? null : zoomOut}
          onZoomIn={isZoomedIn() ? null : zoomIn}
        />
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
            initialBounds={region | regionFromAnnotations}
          />
        </FullPageViewport>
      </SingleTileSource>
    </div>
  );
};

export default withBemClass('slide')(SwappableViewer);
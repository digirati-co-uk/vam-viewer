import React, { useRef, useState } from 'react';
import {
  AnnotationCanvasRepresentation,
  AnnotationDetail,
  Bem,
  CanvasProvider,
  FullPageViewport,
  OpenSeadragonViewer,
  OpenSeadragonViewport,
  SingleTileSource,
  Viewport,
  withBemClass,
} from 'canvas-panel-beta/lib/legacy';
import { Annotation, Canvas } from 'manifesto.js';

const defaultConfig = {
  cssClassPrefix: '',
  manifest: null,
  jsonLdManifest: null,
  cssClassMap: {},
  animationSpeed: 500,
  animationSpeedMap: {},
  fitContainer: false,
  // fixedSize: null, // { x, y }
  height: 500,
  annotationMargin: 600,
  width: 1200,
  mobileHeight: window.innerWidth,
  renderAnnotation: null,
  allowFullScreen: true,
  events: {},
  osdOptions: {},
  dispatch: () => null,
  disableMouseEventsOnMobile: true,
  mobileBreakpoint: 639,
  growthStyle: 'fixed',
  closeText: '×',
  relativeContainer: true,
  clickToClose: true,
  hideSlideShowNav: () => {},
};

const AdaptiveViewport: React.FC<any> = ({
  fullViewport,
  isFullscreen,
  maxWidth,
  maxHeight,
  ...props
}) => {
  if (fullViewport || isFullscreen) {
    return (
      <FullPageViewport position="absolute" interactive={true} {...props}>
        {props.children}
      </FullPageViewport>
    );
  }
  return (
    <Viewport maxWidth={maxWidth} maxHeight={maxHeight} {...props}>
      {props.children}
    </Viewport>
  );
};

export const PatchworkEmbed: React.FC<{
  canvas: Canvas;
  mobileHeight?: number;
  height?: number;
  osdOptions?: any;
  growthStyle?: 'fixed' | 'scaled' | 'absolute';
  closeText?: string;
  fitContainer?: boolean;
  mobileBreakpoint?: number;
  fullscreenEnabled?: boolean;
  isFullscreen?: boolean;
  clickToClose?: boolean;
  annotationMargin?: number;
  animationSpeedMap?: any;
  animationSpeed?: number;
}> = ({
  canvas,
  mobileHeight = defaultConfig.mobileHeight,
  height: desktopHeight = defaultConfig.height,
  osdOptions = defaultConfig.osdOptions,
  growthStyle = defaultConfig.growthStyle,
  closeText = defaultConfig.closeText,
  fitContainer = defaultConfig.fitContainer,
  mobileBreakpoint = defaultConfig.mobileBreakpoint,
  fullscreenEnabled = false,
  isFullscreen = false,
  clickToClose = defaultConfig.clickToClose,
  annotationMargin = defaultConfig.annotationMargin,
  animationSpeedMap = defaultConfig.animationSpeedMap,
  animationSpeed = defaultConfig.animationSpeed,
  ...props
}) => {
  const viewport = useRef<any>();

  const height =
    window.innerWidth < mobileBreakpoint ? mobileHeight : desktopHeight;

  // State.
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  const [annotation, setAnnotation] = useState<Annotation>();

  const getAnimationSpeed = (name: string) => {
    if (animationSpeedMap[name]) {
      return animationSpeedMap[name] / 1000;
    }
    return animationSpeed / 1000;
  };

  // Actions.
  const onClickAnnotation = (selectedAnnotation: Annotation, bounds: any) => {
    if (clickToClose && annotation && annotation.id === selectedAnnotation.id) {
      return onClose();
    }

    setAnnotation(selectedAnnotation);
    viewport.current.goToRect(
      bounds,
      annotationMargin,
      getAnimationSpeed('onClick')
    );
  };
  const toggleMobileFullscreen = () => {
    setIsMobileFullscreen(current => !current);
  };
  const onClose = () => {
    setAnnotation(undefined);

    viewport.current.resetView(getAnimationSpeed('onClose'));
  };

  return (
    <Bem
      prefix="patchwork-"
      cssClassMap={{
        annotation: 'annotation-pin',
      }}
    >
      <CanvasProvider currentCanvas={canvas.id}>
        <AdaptiveViewport
          isFullscreen={fullscreenEnabled ? isFullscreen : false}
          fullViewport={fitContainer}
          maxHeight={
            isFullscreen || isMobileFullscreen ? window.innerHeight : height
          }
          setRef={(ref: any) => (viewport.current = ref)}
        >
          <SingleTileSource
            // @ts-ignore
            viewportController={true}
          >
            <OpenSeadragonViewport>
              <OpenSeadragonViewer
                useMaxDimensions={true}
                osdOptions={{
                  visibilityRatio: 1,
                  constrainDuringPan: true,
                  showNavigator: false,
                  immediateRender: false,
                  ...osdOptions,
                }}
              />
            </OpenSeadragonViewport>
          </SingleTileSource>
          <AnnotationCanvasRepresentation
            ratio={0.1}
            // @ts-ignore
            // ratioFromMaxWidth={1000}
            growthStyle={growthStyle as any}
            bemModifiers={(anno: Annotation) => ({
              selected: annotation ? annotation.id === anno.id : false,
            })}
            // @ts-ignore
            onClickAnnotation={onClickAnnotation}
          />

          {annotation ? (
            <AnnotationDetail
              data-static
              closeText={closeText}
              annotation={annotation}
              onClose={onClose}
              // @ts-ignore
              cssClassMap={{
                'annotation-detail': 'patchwork-annotation-detail',
              }}
            />
          ) : null}
        </AdaptiveViewport>
      </CanvasProvider>
    </Bem>
  );
};

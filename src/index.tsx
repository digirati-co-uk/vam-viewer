import React from 'react';
import { render } from 'react-dom';
import { SlideShow } from './viewers/slideshow/index.js';
import { PopOutViewer } from './viewers/full-page-plugin/index.js';
import { PatchworkPlugin } from './viewers/patch-work-plugin/src/index.js';

import './viewers/patch-work-plugin/src/index';

// export functions here
export function createSlideShow(
  container: HTMLElement,
  iiifResource: string,
  addressable?: boolean,
  backgroundColor?: string,
  id?: number
) {
  render(
    <SlideShow
      manifestUri={iiifResource}
      addressable={addressable}
      id={id}
      backgroundColor={backgroundColor}
    />,
    container
  );
}

export function createFullScreenTour(
  container: HTMLElement,
  iiifResource: string,
  title: string,
  innerHtml: string
) {
  render(
    <PopOutViewer
      manifest={iiifResource}
      title={title}
      innerHtml={innerHtml}
    />,
    container
  );
}

export function createEmbeddedZoom(
  container: HTMLElement,
  iiifResource: string,
  width: number,
  height: number
) {
  render(
    <PatchworkPlugin
      manifest={iiifResource}
      cssClassMap={{
        annotation: 'annotation-pin',
      }}
      cssClassPrefix="patchwork-"
      height={width}
      width={height}
    />,
    container
  );
}

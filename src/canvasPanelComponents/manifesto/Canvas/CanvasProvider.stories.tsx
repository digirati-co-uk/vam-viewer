import React from 'react';
// @ts-ignore
import { CanvasNavigation, LocaleString } from '@canvas-panel/core';
import { ManifestProvider, useManifest } from '../Manifest/ManifestProvider';
import { CanvasProvider, useCanvas } from './CanvasProvider';

export default { title: 'Hooks API | Canvas Provider' };

const MinimumViableViewerInner = () => {
  const manifest = useManifest();
  const {
    nextCanvas,
    prevCanvas,
    sequence,
    startCanvas,
    currentCanvas,
    canvas,
  } = useCanvas();

  return (
    <div>
      <ul>
        <li>
          <CanvasNavigation
            dispatch={(action: any) => {
              switch (action.type) {
                case 'NEXT_CANVAS':
                  nextCanvas();
                  break;
                case 'PREV_CANVAS':
                  prevCanvas();
                  break;
              }
            }}
          />
        </li>
        <li>
          <strong>Total Sequences: </strong>
          {manifest.getTotalSequences()}
        </li>
        <li>
          <strong>At canvas: </strong>
          {startCanvas}
        </li>
        <li>
          <strong>Current canvas: </strong>
          {currentCanvas}
        </li>
        <li>
          <strong>Total canvas: </strong>
          {sequence.getTotalCanvases()}
        </li>
        <li>
          <strong>Canvas label: </strong>
          <LocaleString>{canvas.getLabel()}</LocaleString>
        </li>
        <li>
          <img src={canvas.getCanonicalImageUri(100)} />
        </li>
      </ul>
    </div>
  );
};

export const MinimumViableViewer = () => (
  <ManifestProvider url="https://view.nls.uk/manifest/7446/74464117/manifest.json">
    <CanvasProvider startCanvas={3}>
      <MinimumViableViewerInner />
    </CanvasProvider>
  </ManifestProvider>
);

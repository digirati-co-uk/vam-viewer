import { CanvasProvider } from './CanvasProvider';
import { Manifest } from '../Manifest/Manifest';
// @ts-ignore
import { CanvasNavigation, LocaleString } from '@canvas-panel/core';
import React from 'react';

export default { title: 'Legacy | Canvas Provider' };

export const MinimumViableViewer = () => (
  <Manifest url="https://view.nls.uk/manifest/7446/74464117/manifest.json">
    <CanvasProvider startCanvas={3}>
      {({
        sequence,
        manifest,
        canvas,
        currentCanvas,
        startCanvas,
        dispatch,
      }) => (
        <div>
          <ul>
            <li>
              <CanvasNavigation dispatch={dispatch} />
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
      )}
    </CanvasProvider>
  </Manifest>
);

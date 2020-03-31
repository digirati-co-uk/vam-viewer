import { Canvas, Sequence } from 'manifesto.js';
import { createContext } from '../../utility/create-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useManifest } from '../Manifest/ManifestProvider';

export type CanvasProviderContext = {
  sequence: Sequence;
  canvas: Canvas;
  startCanvas: number | string;
  currentCanvas: number;
  height: number;
  width: number;
};

type CanvasProviderActions = {
  nextCanvas: () => void;
  prevCanvas: () => void;
};

const [useCanvas, InternalCanvasProvider] = createContext<
  CanvasProviderContext & CanvasProviderActions
>();

export { useCanvas };

export type CanvasProviderProps = {
  currentCanvas?: number | string;
  sequence?: number;
  startCanvas?: number | string;
};

export const CanvasProvider: React.FC<CanvasProviderProps> = ({
  startCanvas = 0,
  sequence = 0,
  currentCanvas,
  children,
}) => {
  const [currentCanvasIdx, setCurrentCanvasIdx] = useState(0);
  const manifest = useManifest();

  const setCurrentCanvasFromIdOrIndex = useCallback(
    (value: string | number) => {
      const currentSeq = manifest.getSequenceByIndex(sequence);
      setCurrentCanvasIdx(
        typeof value === 'string'
          ? (currentSeq.getCanvasIndexById(value) as number)
          : value
      );
    },
    [manifest, sequence]
  );

  useEffect(() => {
    if (0 !== startCanvas) {
      setCurrentCanvasFromIdOrIndex(startCanvas);
    }
  }, [setCurrentCanvasFromIdOrIndex, startCanvas]);

  useEffect(() => {
    if (typeof currentCanvas !== 'undefined') {
      setCurrentCanvasFromIdOrIndex(currentCanvas);
    }
  }, [currentCanvas, setCurrentCanvasFromIdOrIndex]);

  const sequenceObj = useMemo(() => manifest.getSequenceByIndex(sequence), [
    manifest,
    sequence,
  ]);

  const canvas = useMemo(() => {
    return sequenceObj.getCanvasByIndex(currentCanvasIdx);
  }, [currentCanvasIdx, sequenceObj]);

  const nextCanvas = useCallback(() => {
    if (sequenceObj.getTotalCanvases() > currentCanvasIdx + 1) {
      setCurrentCanvasIdx(currentCanvasIdx + 1);
    }
  }, [currentCanvasIdx, sequenceObj]);

  const prevCanvas = useCallback(() => {
    setCurrentCanvasIdx(currentCanvasIdx === 0 ? 0 : currentCanvasIdx - 1);
  }, [currentCanvasIdx]);

  return (
    <InternalCanvasProvider
      value={{
        sequence: sequenceObj,
        canvas,
        currentCanvas: currentCanvasIdx,
        height: canvas.getHeight(),
        width: canvas.getWidth(),
        startCanvas,
        nextCanvas,
        prevCanvas,
      }}
    >
      {children}
    </InternalCanvasProvider>
  );
};

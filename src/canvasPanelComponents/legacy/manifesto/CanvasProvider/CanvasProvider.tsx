import React, { useCallback } from 'react';
import { Manifest } from 'manifesto.js';
import {
  CanvasProviderProps,
  CanvasProvider as NewCanvasProvider,
  useCanvas,
  CanvasProviderContext,
} from '../../../manifesto/Canvas/CanvasProvider';
import { useManifest } from '../../../manifesto/Manifest/ManifestProvider';
import functionOrMapChildren, {
  RenderComponent,
} from '../../../utility/function-or-map-children';

type LegacyCanvasActions =
  | { type: CanvasProviderStaticMembers['NEXT_CANVAS'] }
  | { type: CanvasProviderStaticMembers['PREV_CANVAS'] };

type LegacyCanvasProviderRenderProps = {
  manifest: Manifest;
  dispatch: (action: LegacyCanvasActions) => void;
} & CanvasProviderContext;

type CanvasProviderStaticMembers = {
  NEXT_CANVAS: 'NEXT_CANVAS';
  PREV_CANVAS: 'PREV_CANVAS';
  reducer: () => never;
  nextCanvas: () => LegacyCanvasActions;
  prevCanvas: () => LegacyCanvasActions;
};

const CanvasProviderInner: RenderComponent<LegacyCanvasProviderRenderProps> = ({
  children,
}) => {
  const manifest = useManifest();
  const { nextCanvas, prevCanvas, ...canvasProps } = useCanvas();

  const dispatch = useCallback(
    (action: LegacyCanvasActions) => {
      switch (action.type) {
        case 'NEXT_CANVAS':
          nextCanvas();
          break;
        case 'PREV_CANVAS':
          prevCanvas();
          break;
      }
    },
    [nextCanvas, prevCanvas]
  );

  return functionOrMapChildren(children, {
    manifest,
    dispatch,
    ...canvasProps,
  });
};

export const CanvasProvider: RenderComponent<
  LegacyCanvasProviderRenderProps,
  CanvasProviderProps
> &
  CanvasProviderStaticMembers = ({ children, ...props }) => {
  return (
    <NewCanvasProvider {...props}>
      <CanvasProviderInner>{children}</CanvasProviderInner>
    </NewCanvasProvider>
  );
};

CanvasProvider.reducer = () => {
  throw new Error('Use of this internal API is not supported.');
};

CanvasProvider.NEXT_CANVAS = 'NEXT_CANVAS';
CanvasProvider.PREV_CANVAS = 'PREV_CANVAS';

CanvasProvider.nextCanvas = () => {
  return { type: CanvasProvider.NEXT_CANVAS };
};

CanvasProvider.prevCanvas = () => {
  return { type: CanvasProvider.PREV_CANVAS };
};

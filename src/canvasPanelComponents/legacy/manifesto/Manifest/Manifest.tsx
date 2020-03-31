import React, { useMemo } from 'react';
import { Manifest as ManifestoManifest } from 'manifesto.js';
import {
  ManifestProvider,
  ManifestProviderProps,
  useManifest,
} from '../../../manifesto/Manifest/ManifestProvider';
import functionOrMapChildren, {
  MapChildrenType,
  RenderComponent,
} from '../../../utility/function-or-map-children';

const ManifestInner: React.FC<{
  children: MapChildrenType<{ manifest: ManifestoManifest }>;
}> = ({ children }) => {
  const manifest = useManifest();

  return functionOrMapChildren(
    children,
    useMemo(
      () => ({
        manifest,
      }),
      [manifest]
    )
  );
};

export const Manifest: RenderComponent<
  { manifest: ManifestoManifest },
  ManifestProviderProps
> = ({ children, ...props }) => {
  return (
    <ManifestProvider {...props}>
      <ManifestInner>{children}</ManifestInner>
    </ManifestProvider>
  );
};

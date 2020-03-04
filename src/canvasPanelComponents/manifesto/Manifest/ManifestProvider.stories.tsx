import React from 'react';
import { ManifestProvider, useManifest } from './ManifestProvider';
// @ts-ignore
import example from '../../../../examples/ocean-liners.json';

export default { title: 'Hooks API| Manifest' };

const ManifestUrlInner: React.FC = () => {
  const manifest = useManifest();

  return <div>{manifest.getDefaultLabel()}</div>;
};

export const ManifestUrl: React.FC = () => (
  <ManifestProvider url="https://view.nls.uk/manifest/7446/74464117/manifest.json">
    <ManifestUrlInner />
  </ManifestProvider>
);

export const ManifestJson: React.FC = () => (
  <ManifestProvider jsonLd={example}>
    <ManifestUrlInner />
  </ManifestProvider>
);

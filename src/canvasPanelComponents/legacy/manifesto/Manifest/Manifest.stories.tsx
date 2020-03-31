import React from 'react';
import { Manifest } from './Manifest';

export default { title: 'Legacy | Manifest' };

export const ManifestUrl: React.FC = () => {
  return (
    <Manifest url="https://view.nls.uk/manifest/7446/74464117/manifest.json">
      {({ manifest }) => <div>{manifest.getDefaultLabel()}</div>}
    </Manifest>
  );
};

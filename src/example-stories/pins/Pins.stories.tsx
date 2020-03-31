import React, { useRef } from 'react';
import { PatchworkPlugin } from '../../viewers/patch-work-plugin/src/index';
import './_pins.scss';
export default { title: 'Pins Example | Pins' };

export const PinsStory: React.FC = () => {
  const pinsEl = useRef('patchwork');

  return (
    <div className="patchwork-container">
      <PatchworkPlugin
        manifest="https://stephenwf.github.io/ocean-liners.json"
        cssClassMap={{
          annotation: 'annotation-pin',
        }}
        cssClassPrefix="patchwork-"
        height={500}
        width={1200}
      />
    </div>
  );
};

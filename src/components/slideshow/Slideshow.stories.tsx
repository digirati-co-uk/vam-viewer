import React, { useRef } from 'react';
//@ts-ignore
import { SlideShow } from '../../canvasPanelComponents/slideshow/src/index.js';

export default { title: 'Slideshow| Slideshow' };

export const SlideshowStory: React.FC = () => {
  const slideShowEl = useRef('slideShowEl');

  return (
    <div id="slideShowEl" style={{ height: '100vh' }}>
      <SlideShow
        element={slideShowEl}
        manifestUri="https://raw.githubusercontent.com/4d4mm/adam-digirati.github.io/master/balenciaga4.json"
      />
    </div>
  );
};
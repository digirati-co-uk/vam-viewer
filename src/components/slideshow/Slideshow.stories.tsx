import React, { useRef } from 'react';
//@ts-ignore
import { SlideShow } from '../../canvasPanelComponents/slideshow/src/index.js';
export default { title: 'Slideshow | Slideshow', decorators: [withKnobs] };
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

export const SingleSlideShow: React.FC = () => {
  const slideShowEl = useRef('slideShowEl');
  return (
    <div id="slideShowEl" style={{ height: '100vh' }}>
      <SlideShow
        element={slideShowEl}
        manifestUri={text(
          'Manifest',
          'https://raw.githubusercontent.com/4d4mm/adam-digirati.github.io/master/balenciaga4.json'
        )}
        addressable={boolean('Make URLs Addressable', true)}
        id={0}
      />
    </div>
  );
};

export const MultipleSlideShows: React.FC = () => {
  const slideShowEl = useRef('slideShowEl');

  return (
    <div id="slideShowEl" style={{ height: '50vh' }}>
      <SlideShow
        element={slideShowEl}
        manifestUri={text(
          'Top Manifest',
          'https://raw.githubusercontent.com/4d4mm/adam-digirati.github.io/master/balenciaga4.json'
        )}
        addressable={boolean('Make URLs Addressable', true)}
        id={0}
      />
      <SlideShow
        element={slideShowEl}
        manifestUri={text(
          'Bottom Manifest',
          'https://raw.githubusercontent.com/4d4mm/adam-digirati.github.io/master/balenciaga4.json'
        )}
        addressable={boolean('Make URLs Addressable', true)}
        id={1}
      />
    </div>
  );
};

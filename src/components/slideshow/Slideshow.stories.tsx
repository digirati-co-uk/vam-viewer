import React, { useRef } from 'react';
//@ts-ignore
import { SlideShow } from '../../canvasPanelComponents/slideshow/src/index.js';
export default { title: 'Slideshow | Slideshow', decorators: [withKnobs] };
import { withKnobs, text, boolean, color } from '@storybook/addon-knobs';

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
        addressable={boolean('Make URLs Addressable', false)}
        id={0}
        backgroundColor={color('Background Colour', '#000000')}
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
          'https://iiif-collection.ch.digtest.co.uk/p3/testingmosaics-v4.json'
        )}
        addressable={boolean('Make URLs Addressable', false)}
        id={0}
        backgroundColor={color('Top Background Colour', '#000000')}
      />
      <div style={{ height: '10px', backgroundColor: 'yellow' }} />
      <SlideShow
        element={slideShowEl}
        manifestUri={text(
          'Bottom Manifest',
          'https://raw.githubusercontent.com/4d4mm/adam-digirati.github.io/master/balenciaga4.json'
        )}
        addressable={boolean('Make URLs Addressable', false)}
        id={1}
        backgroundColor={color('Bottom Background Colour', '#000000')}
      />
    </div>
  );
};

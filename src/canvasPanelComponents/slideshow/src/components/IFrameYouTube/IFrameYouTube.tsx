import React from 'react';

import { useSwipeable } from 'react-swipeable';
// this is a hook to listen for swipes

interface IFrameYouTubeProps {
  url: string;
  onNext: () => void;
  onPrevious: () => void;
  onDragStart: () => void;
  onDragStop: () => void;
}

export const IFrameYouTube: React.FC<IFrameYouTubeProps> = ({
  url,
  onDragStart = () => {},
  onDragStop = () => {},
}) => {
  const handlers = useSwipeable({
    onSwiping: e => handleSwipe(e),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
  const handleSwipe = (event: any) => {
    if (event.first === true) {
      onDragStart();
    }
    // } else {
    //   onDragStop();
    // }
  };
  return (
    <div style={{ height: '100%' }} {...handlers} onTouchEnd={onDragStop}>
      <iframe
        width="100%"
        height="60%"
        style={{ marginTop: '120px' }}
        src={url}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

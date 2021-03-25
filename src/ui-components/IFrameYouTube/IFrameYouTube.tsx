import React from 'react';

import { useSwipeable } from 'react-swipeable';
// this is a hook to listen for swipes

interface IFrameYouTubeProps {
  url: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
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
  };

  return (
    <div
      style={{
        height: '100%',
        background: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...handlers}
      onTouchEnd={onDragStop}
    >
      <iframe
        width="100%"
        height="60%"
        src={`http://www.youtube.com/embed/${new URL(url).searchParams.get('v')}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

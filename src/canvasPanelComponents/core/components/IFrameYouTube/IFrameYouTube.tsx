import React from 'react';

interface IFrameYouTubeProps {
  url: string;
}

export const IFrameYouTube: React.FC<IFrameYouTubeProps> = ({ url }) => {
  return (
    <iframe
      width="100%"
      height="100%"
      src={url}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

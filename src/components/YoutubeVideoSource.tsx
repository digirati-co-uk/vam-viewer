import React, { useEffect, useState } from 'react';
import { useCanvas } from 'canvas-panel-beta/lib/manifesto/Canvas/CanvasProvider';
import { IFrameYouTube } from '../canvasPanelComponents/slideshow/src/components/IFrameYouTube/IFrameYouTube';

export const YoutubeVideoSource: React.FC = props => {
  const { canvas } = useCanvas();
  const content = canvas ? canvas.getContent() : [];
  const [youtubeUrl, setYoutubeUrl] = useState<string>();

  useEffect(() => {
    setYoutubeUrl('');
    for (const annotation of content) {
      const body = annotation.getBody();
      if (
        body &&
        (body[0].getType() || '').toLowerCase() === 'video' &&
        body[0].id.indexOf('youtube.com') !== -1
      ) {
        setYoutubeUrl(body[0].id);
      }
    }
  }, [content, canvas]);

  if (!content.length || !youtubeUrl) {
    return <React.Fragment />;
  }

  return (
    <>
      <IFrameYouTube url={youtubeUrl} />
      {props.children}
    </>
  );
};

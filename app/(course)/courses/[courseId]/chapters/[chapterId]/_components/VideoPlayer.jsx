import React from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

export default function SingleVideoPlayer({ videoUrl }) {
  return (
    <div>
      <Plyr
        source={{
          type: 'video',
          sources: [{ src: videoUrl }],
        }}
      />
    </div>
  );
}

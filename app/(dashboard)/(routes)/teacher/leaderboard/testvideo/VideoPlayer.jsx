import React from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

export default function SingleVideoPlayer({ videoUrl }) {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center', /* Center horizontally */
      width: '100%', 
      maxWidth: '600px', 
      height: 'auto' 
    }}>
      <Plyr
        source={{
          type: 'video',
          sources: [{ src: videoUrl }],
        }}
      />
    </div>
  );
}

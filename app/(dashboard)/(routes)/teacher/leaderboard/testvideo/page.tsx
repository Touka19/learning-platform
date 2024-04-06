"use client";
import React from 'react';
import SingleVideoPlayer from './VideoPlayer';

export default function App() {
  const videoUrl = 'https://gdapi.viatg.workers.dev/download.aspx?file=Q8tTJ9HurLF7bSubZvH4o7yWfAcuvvEA1SqY0N%2BjrNHxfULW0QrhZ9snIdBwxWKb&expiry=%2BTbM0NnXq0LRyx1Kk9swAw%3D%3D&mac=9d82f5bcdf88f4d1326c3df78e4b5ba1eaa4ce9f1587f0fb5e451dafd8714469'; // Replace with your video URL

  return (
    <div>
      <h1>Single Video Player Demo</h1>
      <SingleVideoPlayer videoUrl={videoUrl} />
    </div>
  );
}

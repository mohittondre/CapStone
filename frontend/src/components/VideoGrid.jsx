import VideoCard from './VideoCard';
import './VideoGrid.css';

function VideoGrid({ videos }) {
  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard key={video.videoId} video={video} />
      ))}
    </div>
  );
}

export default VideoGrid;


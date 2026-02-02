import VideoCard from './VideoCard';
import './VideoGrid.css';

function VideoGrid({ videos, searchQuery, onVideoClick }) {
  if (videos.length === 0) {
    return (
      <div className="no-results">
        <h2>No results found</h2>
        <p>Try different keywords or remove search filters</p>
        {searchQuery && (
          <p>Searching for: "<strong>{searchQuery}</strong>"</p>
        )}
      </div>
    );
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard key={video.videoId} video={video} onClick={onVideoClick} />
      ))}
    </div>
  );
}

export default VideoGrid;

import './VideoCard.css';

function VideoCard({ video }) {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M views';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K views';
    }
    return views + ' views';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      return Math.floor(diffDays / 365) + ' years ago';
    } else if (diffDays > 30) {
      return Math.floor(diffDays / 30) + ' months ago';
    } else {
      return diffDays + ' days ago';
    }
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail">
        <img src={video.thumbnailUrl} alt={video.title} />
        <span className="video-duration">12:45</span>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-channel">{video.channelName}</p>
        <p className="video-meta">{formatViews(video.views)} • {formatDate(video.uploadDate)}</p>
      </div>
    </div>
  );
}

export default VideoCard;


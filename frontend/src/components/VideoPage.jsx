import { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import './VideoPage.css';

function VideoPage({ video, onBack, user, allVideos }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [likes, setLikes] = useState(video.likes || 0);
  const [dislikes, setDislikes] = useState(video.dislikes || 0);
  const [userReaction, setUserReaction] = useState(null);

  // Get related videos (same category, excluding current video)
  const relatedVideos = allVideos
    .filter(v => v.videoId !== video.videoId && v.category === video.category)
    .slice(0, 10);

  useEffect(() => {
    const loadComments = () => {
      const savedComments = localStorage.getItem(`comments_${video.videoId}`);
      if (savedComments) {
        try {
          setComments(JSON.parse(savedComments));
        } catch (e) {
          console.error('Error parsing comments:', e);
          setComments(video.comments || []);
        }
      } else {
        setComments(video.comments || []);
      }
    };

    loadComments();
  }, [video]);

  const saveComments = (updatedComments) => {
    localStorage.setItem(`comments_${video.videoId}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      commentId: `comment_${Date.now()}`,
      userId: user?.username || 'Anonymous',
      userName: user?.username || 'Anonymous',
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    };

    const updatedComments = [comment, ...comments];
    saveComments(updatedComments);
    setNewComment('');
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter(c => c.commentId !== commentId);
    saveComments(updatedComments);
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditText(comment.text);
  };

  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) return;

    const updatedComments = comments.map(c => 
      c.commentId === commentId ? { ...c, text: editText.trim() } : c
    );
    saveComments(updatedComments);
    setEditingCommentId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const handleLike = () => {
    if (userReaction === 'like') {
      setUserReaction(null);
      setLikes(likes - 1);
    } else {
      setUserReaction('like');
      setLikes(likes + 1);
      if (userReaction === 'dislike') {
        setDislikes(dislikes - 1);
      }
    }
  };

  const handleDislike = () => {
    if (userReaction === 'dislike') {
      setUserReaction(null);
      setDislikes(dislikes - 1);
    } else {
      setUserReaction('dislike');
      setDislikes(dislikes + 1);
      if (userReaction === 'like') {
        setLikes(likes - 1);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  return (
    <div className="video-page">
      <button className="back-button" onClick={onBack}>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back
      </button>

      <div className="video-page-content">
        <div className="video-main">
          <div className="video-player">
            <div className="video-placeholder">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="currentColor" d="M8 5v14l11-7z"/>
              </svg>
              <span>{video.title}</span>
            </div>
          </div>

          <h1 className="video-title">{video.title}</h1>
          
          <div className="video-stats">
            <span>{video.views.toLocaleString()} views</span>
            <span>•</span>
            <span>{formatDate(video.uploadDate)}</span>
          </div>

          <div className="video-actions">
            <button 
              className={`action-button ${userReaction === 'like' ? 'active' : ''}`}
              onClick={handleLike}
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>{likes.toLocaleString()}</span>
            </button>
            
            <button 
              className={`action-button ${userReaction === 'dislike' ? 'active' : ''}`}
              onClick={handleDislike}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" style={{ transform: 'rotate(180deg)' }}>
                <path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>{dislikes.toLocaleString()}</span>
            </button>

            <button className="action-button">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <span>Share</span>
            </button>
          </div>

          <div className="channel-info">
            <div className="channel-avatar">
              {video.channelName.charAt(0)}
            </div>
            <div className="channel-details">
              <h3 className="channel-name">{video.channelName}</h3>
              <p className="channel-subscribers">1.2M subscribers</p>
            </div>
            <button className="subscribe-button">Subscribe</button>
          </div>

          <div className="video-description">
            <p>{video.description}</p>
          </div>

          <div className="comments-section">
            <h2 className="comments-count">{comments.length} Comments</h2>
            
            <form className="comment-form" onSubmit={handleAddComment}>
              {user ? (
                <>
                  <div className="comment-avatar">
                    {user.username.charAt(0)}
                  </div>
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="comment-actions">
                    <button type="button" className="cancel-btn" onClick={() => setNewComment('')}>Cancel</button>
                    <button type="submit" className="submit-btn" disabled={!newComment.trim()}>Comment</button>
                  </div>
                </>
              ) : (
                <p className="login-prompt">Sign in to comment</p>
              )}
            </form>

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.commentId} className="comment">
                  <div className="comment-avatar">
                    {comment.userName?.charAt(0) || 'A'}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-user">{comment.userName || 'Anonymous'}</span>
                      <span className="comment-date">{formatCommentDate(comment.timestamp)}</span>
                    </div>
                    
                    {editingCommentId === comment.commentId ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="edit-input"
                        />
                        <div className="edit-actions">
                          <button onClick={() => handleSaveEdit(comment.commentId)} className="save-btn">Save</button>
                          <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="comment-text">{comment.text}</p>
                    )}
                    
                    <div className="comment-actions-row">
                      <button className="comment-action-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                        </svg>
                        <span>{comment.likes || 0}</span>
                      </button>
                      
                      {(user?.username === comment.userId || user?.username === comment.userName) && (
                        <>
                          <button 
                            className="comment-action-btn" 
                            onClick={() => handleStartEdit(comment)}
                          >
                            Edit
                          </button>
                          <button 
                            className="comment-action-btn delete"
                            onClick={() => handleDeleteComment(comment.commentId)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="video-sidebar">
          <h3>Up next</h3>
          <div className="related-videos">
            {relatedVideos.map((relatedVideo) => (
              <div 
                key={relatedVideo.videoId} 
                className="related-video-item"
                onClick={() => {
                  // Create a new event for video selection
                  const event = new CustomEvent('videoSelected', { detail: relatedVideo });
                  window.dispatchEvent(event);
                }}
              >
                <div className="related-thumbnail">
                  <img src={relatedVideo.thumbnailUrl} alt={relatedVideo.title} />
                  <span className="related-duration">12:45</span>
                </div>
                <div className="related-info">
                  <h4 className="related-title">{relatedVideo.title}</h4>
                  <p className="related-channel">{relatedVideo.channelName}</p>
                  <p className="related-views">{relatedVideo.views.toLocaleString()} views</p>
                </div>
              </div>
            ))}
            {relatedVideos.length === 0 && (
              <p className="no-related">No related videos found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPage;

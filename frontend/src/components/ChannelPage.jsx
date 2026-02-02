import { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import './ChannelPage.css';

function ChannelPage({ user, channel, onBack, allVideos, onUpdateVideo, onDeleteVideo, showCreateChannel, setShowCreateChannel, setSelectedChannel }) {
  const [channelVideos, setChannelVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');

  useEffect(() => {
    const loadChannelData = () => {
      if (channel) {
        // Filter videos for this channel
        const videos = allVideos.filter(v => v.channelId === channel.channelId);
        setChannelVideos(videos);
      }
    };

    loadChannelData();
  }, [user, channel, allVideos]);

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const newChannel = {
      channelId: `channel_${user.userId}_${Date.now()}`,
      name: newChannelName.trim(),
      description: newChannelDescription.trim(),
      ownerId: user.userId,
      createdAt: new Date().toISOString(),
      subscriberCount: 0
    };

    // Save channel to localStorage
    const userChannels = JSON.parse(localStorage.getItem(`channels_${user.userId}`)) || [];
    userChannels.push(newChannel);
    localStorage.setItem(`channels_${user.userId}`, JSON.stringify(userChannels));

    // Update user's channel list
    const updatedUser = { ...user, channels: [...(user.channels || []), newChannel.channelId] };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setShowCreateChannel(false);
    setSelectedChannel(newChannel);
  };

  const handleStartEdit = (video) => {
    setEditingVideo(video.videoId);
    setEditTitle(video.title);
    setEditDescription(video.description);
  };

  const handleSaveEdit = (video) => {
    const updatedVideo = {
      ...video,
      title: editTitle.trim(),
      description: editDescription.trim()
    };

    // Update in parent state
    onUpdateVideo(updatedVideo);

    // Update localStorage
    const storedVideos = localStorage.getItem('allVideos');
    let allVideosUpdated = storedVideos ? JSON.parse(storedVideos) : [...allVideos];
    const videoIndex = allVideosUpdated.findIndex(v => v.videoId === video.videoId);
    if (videoIndex !== -1) {
      allVideosUpdated = [
        ...allVideosUpdated.slice(0, videoIndex),
        updatedVideo,
        ...allVideosUpdated.slice(videoIndex + 1)
      ];
      localStorage.setItem('allVideos', JSON.stringify(allVideosUpdated));
    }

    setEditingVideo(null);
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDelete = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      onDeleteVideo(videoId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (showCreateChannel) {
    return (
      <div className="channel-page">
        <button className="back-button" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back
        </button>

        <div className="create-channel-form">
          <div className="create-channel-card">
            <h2>Create Your Channel</h2>
            <p>Set up your YouTube channel to start sharing your videos</p>
            
            <form onSubmit={handleCreateChannel}>
              <div className="form-group">
                <label htmlFor="channelName">Channel Name</label>
                <input
                  type="text"
                  id="channelName"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="Enter channel name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="channelDescription">Description (optional)</label>
                <textarea
                  id="channelDescription"
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                  placeholder="Tell viewers about your channel"
                  rows="4"
                />
              </div>
              
              <button type="submit" className="create-channel-btn">
                Create Channel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="channel-page">
      <button className="back-button" onClick={onBack}>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back
      </button>

      <div className="channel-header">
        <div className="channel-banner">
          <div className="channel-avatar-large">
            {channel?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
        </div>
        
        <div className="channel-info">
          <h1 className="channel-title">{channel?.name || user?.username}</h1>
          <p className="channel-handle">@{channel?.name?.toLowerCase().replace(/\s+/g, '') || user?.username?.toLowerCase()}</p>
          <p className="channel-stats">
            {channelVideos.length} videos • {channel?.subscriberCount || 0} subscribers
          </p>
          {channel?.description && (
            <p className="channel-description">{channel.description}</p>
          )}
          <p className="channel-joined">Joined {channel?.createdAt ? formatDate(channel.createdAt) : formatDate(user.createdAt || new Date().toISOString())}</p>
        </div>
      </div>

      <div className="channel-content">
        <div className="channel-tabs">
          <button className="tab active">Videos</button>
          <button className="tab">Playlists</button>
          <button className="tab">Community</button>
          <button className="tab">Channels</button>
          <button className="tab">About</button>
        </div>

        <div className="channel-videos-section">
          <h2>Videos</h2>
          
          {channelVideos.length === 0 ? (
            <div className="no-videos">
              <svg viewBox="0 0 24 24" width="64" height="64">
                <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
              <h3>No videos yet</h3>
              <p>Upload your first video to start building your channel</p>
            </div>
          ) : (
            <div className="channel-video-grid">
              {channelVideos.map((video) => (
                <div key={video.videoId} className="channel-video-card">
                  {editingVideo === video.videoId ? (
                    <div className="video-edit-form">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Video title"
                        className="edit-input"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Video description"
                        rows="3"
                        className="edit-textarea"
                      />
                      <div className="edit-actions">
                        <button onClick={() => handleSaveEdit(video)} className="save-btn">Save</button>
                        <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="video-thumbnail-container">
                        <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail-img" />
                        <span className="video-duration">12:45</span>
                      </div>
                      <div className="video-details">
                        <h3 className="video-title">{video.title}</h3>
                        <p className="video-views">{video.views.toLocaleString()} views</p>
                        <p className="video-date">{formatDate(video.uploadDate)}</p>
                        <div className="video-actions-row">
                          <button 
                            className="video-action-btn"
                            onClick={() => handleStartEdit(video)}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="video-action-btn delete"
                            onClick={() => handleDelete(video.videoId)}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChannelPage;


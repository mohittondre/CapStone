import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'youtube-clone-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (replace with database in production)
let users = [
  {
    userId: 'user01',
    username: 'JohnDoe',
    email: 'john@example.com',
    password: '$2a$10$XQxBtJNKPm8tGyZ8pN5EpeFKtYQ3G5s5tNKdQ5p5p5p5p5p5p5p5p',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    channels: ['channel01'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    userId: 'user02',
    username: 'JaneSmith',
    email: 'jane@example.com',
    password: '$2a$10$XQxBtJNKPm8tGyZ8pN5EpeFKtYQ3G5s5tNKdQ5p5p5p5p5p5p5p5p',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    channels: ['channel02'],
    createdAt: '2024-01-02T00:00:00Z'
  }
];

let channels = [
  {
    channelId: 'channel01',
    name: 'CodeMaster Pro',
    description: 'Teaching programming concepts through practical examples',
    ownerId: 'user01',
    subscriberCount: 12500,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    channelId: 'channel02',
    name: 'JS Wizard',
    description: 'Master JavaScript and modern web development',
    ownerId: 'user02',
    subscriberCount: 8900,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    channelId: 'channel03',
    name: 'Web Dev Simplified',
    description: 'Making web development easy to understand',
    ownerId: 'user03',
    subscriberCount: 23400,
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    channelId: 'channel04',
    name: 'Backend Master',
    description: 'Backend development tutorials and best practices',
    ownerId: 'user04',
    subscriberCount: 15600,
    createdAt: '2024-01-04T00:00:00Z'
  }
];

let videos = [
  {
    videoId: 'video01',
    title: 'Learn React in 30 Minutes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop',
    description: 'A quick tutorial to get started with React.',
    channelId: 'channel01',
    channelName: 'CodeMaster Pro',
    uploader: 'user01',
    views: 15200,
    likes: 1023,
    dislikes: 45,
    uploadDate: '2024-09-20',
    category: 'React',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  },
  {
    videoId: 'video02',
    title: 'JavaScript ES6 Features Explained',
    thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=640&h=360&fit=crop',
    description: 'Master modern JavaScript with ES6+ features.',
    channelId: 'channel02',
    channelName: 'JS Wizard',
    uploader: 'user02',
    views: 28500,
    likes: 2100,
    dislikes: 89,
    uploadDate: '2024-09-15',
    category: 'JavaScript',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  },
  {
    videoId: 'video03',
    title: 'CSS Grid Layout Tutorial',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=640&h=360&fit=crop',
    description: 'Complete guide to CSS Grid layout system.',
    channelId: 'channel03',
    channelName: 'Web Dev Simplified',
    uploader: 'user03',
    views: 42300,
    likes: 3500,
    dislikes: 120,
    uploadDate: '2024-09-10',
    category: 'Computers',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  },
  {
    videoId: 'video04',
    title: 'Build a Todo App with React',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&h=360&fit=crop',
    description: 'Step by step tutorial to build a todo application.',
    channelId: 'channel01',
    channelName: 'CodeMaster Pro',
    uploader: 'user01',
    views: 18900,
    likes: 1450,
    dislikes: 56,
    uploadDate: '2024-09-05',
    category: 'React',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  },
  {
    videoId: 'video05',
    title: 'Node.js Crash Course',
    thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=640&h=360&fit=crop',
    description: 'Learn Node.js from scratch in this comprehensive course.',
    channelId: 'channel04',
    channelName: 'Backend Master',
    uploader: 'user04',
    views: 56700,
    likes: 4800,
    dislikes: 210,
    uploadDate: '2024-08-28',
    category: 'Computers',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  }
];

let comments = [
  {
    commentId: 'comment01',
    videoId: 'video01',
    userId: 'user02',
    username: 'JaneSmith',
    text: 'Great video! Very helpful.',
    timestamp: '2024-09-21T08:30:00Z'
  }
];

// Helper functions
const generateToken = (user) => {
  return jwt.sign({ userId: user.userId, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user${users.length + 1}`;
    
    const newUser = {
      userId,
      username,
      email,
      password: hashedPassword,
      avatar: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1535713875002-d1d0cf377fde' : '1494790108377-be9c29b29330'}?w=100&h=100&fit=crop`,
      channels: [],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.userId === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// ============ VIDEO ROUTES ============

// Get all videos
app.get('/api/videos', (req, res) => {
  const { category, search } = req.query;
  let filteredVideos = [...videos];
  
  if (category && category !== 'All') {
    filteredVideos = filteredVideos.filter(v => v.category === category);
  }
  
  if (search) {
    const query = search.toLowerCase();
    filteredVideos = filteredVideos.filter(v => 
      v.title.toLowerCase().includes(query) ||
      v.description.toLowerCase().includes(query) ||
      v.channelName.toLowerCase().includes(query)
    );
  }
  
  res.json(filteredVideos);
});

// Get video by ID
app.get('/api/videos/:id', (req, res) => {
  const video = videos.find(v => v.videoId === req.params.id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  
  // Increment views
  video.views += 1;
  
  res.json(video);
});

// Get videos by channel
app.get('/api/channels/:id/videos', (req, res) => {
  const channelVideos = videos.filter(v => v.channelId === req.params.id);
  res.json(channelVideos);
});

// Create video (authenticated)
app.post('/api/videos', authenticateToken, (req, res) => {
  try {
    const { title, description, channelId, category } = req.body;
    
    if (!title || !channelId) {
      return res.status(400).json({ error: 'Title and channel ID are required' });
    }
    
    const channel = channels.find(c => c.channelId === channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    
    const newVideo = {
      videoId: `video${uuidv4().slice(0, 4)}`,
      title,
      thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop',
      description: description || '',
      channelId,
      channelName: channel.name,
      uploader: req.user.userId,
      views: 0,
      likes: 0,
      dislikes: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      category: category || 'Computers',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
    };
    
    videos.unshift(newVideo);
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update video (authenticated)
app.put('/api/videos/:id', authenticateToken, (req, res) => {
  try {
    const video = videos.find(v => v.videoId === req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    if (video.uploader !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this video' });
    }
    
    const { title, description } = req.body;
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete video (authenticated)
app.delete('/api/videos/:id', authenticateToken, (req, res) => {
  try {
    const videoIndex = videos.findIndex(v => v.videoId === req.params.id);
    if (videoIndex === -1) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const video = videos[videoIndex];
    if (video.uploader !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this video' });
    }
    
    videos.splice(videoIndex, 1);
    
    // Delete associated comments
    comments = comments.filter(c => c.videoId !== req.params.id);
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like video
app.post('/api/videos/:id/like', (req, res) => {
  const video = videos.find(v => v.videoId === req.params.id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  
  video.likes += 1;
  res.json(video);
});

// ============ COMMENT ROUTES ============

// Get comments for video
app.get('/api/videos/:id/comments', (req, res) => {
  const videoComments = comments.filter(c => c.videoId === req.params.id);
  
  // Enrich with user data
  const enrichedComments = videoComments.map(comment => {
    const user = users.find(u => u.userId === comment.userId);
    return {
      ...comment,
      userAvatar: user?.avatar
    };
  });
  
  res.json(enrichedComments);
});

// Add comment (authenticated)
app.post('/api/videos/:id/comments', authenticateToken, (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    const video = videos.find(v => v.videoId === req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const user = users.find(u => u.userId === req.user.userId);
    
    const newComment = {
      commentId: `comment${uuidv4().slice(0, 4)}`,
      videoId: req.params.id,
      userId: req.user.userId,
      username: user?.username || req.user.username,
      text,
      timestamp: new Date().toISOString(),
      userAvatar: user?.avatar
    };
    
    comments.push(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ CHANNEL ROUTES ============

// Get all channels
app.get('/api/channels', (req, res) => {
  res.json(channels);
});

// Get channel by ID
app.get('/api/channels/:id', (req, res) => {
  const channel = channels.find(c => c.channelId === req.params.id);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  // Get channel owner
  const owner = users.find(u => u.userId === channel.ownerId);
  
  // Get video count
  const videoCount = videos.filter(v => v.channelId === channel.channelId).length;
  
  res.json({
    ...channel,
    owner,
    videoCount
  });
});

// Create channel (authenticated)
app.post('/api/channels', authenticateToken, (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Channel name is required' });
    }
    
    // Check if user already has a channel
    const existingChannel = channels.find(c => c.ownerId === req.user.userId);
    if (existingChannel) {
      return res.status(400).json({ error: 'You already have a channel' });
    }
    
    const newChannel = {
      channelId: `channel${uuidv4().slice(0, 4)}`,
      name,
      description: description || '',
      ownerId: req.user.userId,
      subscriberCount: 0,
      createdAt: new Date().toISOString()
    };
    
    channels.push(newChannel);
    
    // Update user's channels array
    const user = users.find(u => u.userId === req.user.userId);
    if (user) {
      user.channels.push(newChannel.channelId);
    }
    
    res.status(201).json(newChannel);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's channel
app.get('/api/users/:id/channel', authenticateToken, (req, res) => {
  const channel = channels.find(c => c.ownerId === req.params.id);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  const videoCount = videos.filter(v => v.channelId === channel.channelId).length;
  
  res.json({
    ...channel,
    videoCount
  });
});

// ============ SEARCH ROUTE ============

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  const query = q.toLowerCase();
  
  const videoResults = videos.filter(v => 
    v.title.toLowerCase().includes(query) ||
    v.description.toLowerCase().includes(query) ||
    v.channelName.toLowerCase().includes(query)
  );
  
  const channelResults = channels.filter(c => 
    c.name.toLowerCase().includes(query) ||
    c.description.toLowerCase().includes(query)
  );
  
  res.json({
    videos: videoResults,
    channels: channelResults
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});


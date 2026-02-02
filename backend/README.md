# YouTube Clone Backend

This is the backend API for the YouTube Clone application built with Node.js and Express.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Videos**: CRUD operations for videos, like functionality
- **Comments**: Add and retrieve comments on videos
- **Channels**: Create and manage channels
- **Search**: Search videos and channels

## Tech Stack

- Node.js
- Express.js
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing
- cors for cross-origin resource sharing
- uuid for generating unique IDs

## Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (authenticated) |

### Videos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | Get all videos (with optional category/search filters) |
| GET | `/api/videos/:id` | Get video by ID |
| POST | `/api/videos` | Create a new video (authenticated) |
| PUT | `/api/videos/:id` | Update a video (authenticated) |
| DELETE | `/api/videos/:id` | Delete a video (authenticated) |
| POST | `/api/videos/:id/like` | Like a video |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos/:id/comments` | Get comments for a video |
| POST | `/api/videos/:id/comments` | Add a comment (authenticated) |

### Channels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/channels` | Get all channels |
| GET | `/api/channels/:id` | Get channel by ID |
| POST | `/api/channels` | Create a channel (authenticated) |
| GET | `/api/channels/:id/videos` | Get videos for a channel |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=query` | Search videos and channels |

## Sample Data

The backend includes sample users, channels, and videos for testing:

### Users
- User 1: john@example.com / password123
- User 2: jane@example.com / password123

### Categories
- React
- JavaScript
- Computers

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | JWT signing secret | youtube-clone-secret-key-2024-secure |

## Future Improvements

- Add database (MongoDB/PostgreSQL)
- Add file upload for video thumbnails
- Add pagination for videos and comments
- Add subscription/unsubscription endpoints
- Add watch history
- Implement proper validation with Joi/Zod


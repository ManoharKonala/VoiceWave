# VoiceWave

VoiceWave is a social audio platform built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript on the frontend. It allows users to record, share, and listen to audio content, with rich social features.

## Core Functionality
- User Authentication (JWT, registration, login, protected routes)
- Audio Features (upload to Cloudinary, playback, feed, like/comment, user collections)
- Social Features (follow/unfollow, activity feed, user stats, comments)

## Technical Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Cloudinary, Socket.IO
- **Frontend:** React, TypeScript, Redux Toolkit, Material-UI, Formik, Yup, react-h5-audio-player, Axios

## Project Structure
```
VoiceWave/
  backend/
    server.js
    models/
      User.js
      Audio.js
    controllers/
    routes/
    middleware/
  frontend/
    src/
      pages/
      components/
      store/
      services/
      hooks/
```

## Recommendations for Improvement
- Add pagination, code splitting, rate limiting, and better CORS
- Add audio editing, search, transcription, offline support
- Improve test coverage and documentation

---

This file provides an overview and guidance for contributors. See each folder for more details.

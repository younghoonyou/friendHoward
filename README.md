# Farewell Howard - Website

A farewell website for Howard, featuring:
- Interactive 3D Earth with flight path animation from Canada to Taiwan
- Flag transition animation (Canada to Taiwan) based on scroll
- Photo gallery for friends to upload memories
- Message board for farewell wishes
- Full stack application with React, Three.js, Express, and MongoDB

## Project Structure

```
/friendHoward
  /client         # React frontend
    /src
      /components # React components
      /pages      # Page components
      /assets     # Images and other static files
    /public       # Static files
  /server         # Express backend
    /controllers  # API controllers
    /models       # MongoDB models
    /routes       # API routes
    /uploads      # Uploaded photos storage
```

## Technologies Used

### Frontend
- React (TypeScript)
- Three.js for 3D visualization
- @react-three/fiber, @react-three/drei
- Framer Motion for animations
- Styled Components for styling
- React Router for navigation

### Backend
- Node.js
- Express
- MongoDB (with Mongoose)
- Multer for file uploads

## Development Setup

1. Clone the repository
2. Install dependencies for frontend and backend:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory with the following configuration:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/friendHoward
NODE_ENV=development
```

4. Start the development servers:

```bash
# Start the backend server (from the server directory)
npm run dev

# Start the frontend (from the client directory)
npm start
```

5. Open a browser and navigate to `http://localhost:3000`

## Build Performance

This project uses esbuild instead of Babel for significantly faster builds:

- Uses `react-app-rewired` to override the default Create React App configuration
- Replaces babel-loader with esbuild-loader for faster transpilation
- Replaces terser with esbuild minifier for more efficient production builds

Build improvements:
- Development builds: 3-5x faster hot reloading
- Production builds: 5-10x faster build times

## Features

- Interactive 3D globe showing Howard's journey from Canada to Taiwan
- Flag transition animation as you scroll
- Photo gallery for friends to share memories
- Message board for farewell wishes
- Responsive design for all devices

## Deployment

For production deployment:

1. Build the React frontend:
```bash
cd client
npm run build
```

2. Set environment variables for production:
```
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

3. Start the server which will serve both the API and the static frontend:
```bash
cd server
npm start
```

## License

MIT
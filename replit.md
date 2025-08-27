# Overview

This is a task management web application called "Tugas Manager" built with React and Express.js. The application allows users to upload, manage, and download assignment files with a focus on Indonesian language support. It features a modern dark/light theme interface and uses MongoDB with GridFS for file storage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 19.1.1 with Vite as the build tool
- **Styling**: Tailwind CSS 3.3.0 with custom dark mode implementation (downgraded from v4 for compatibility)
- **Routing**: React Router DOM for client-side navigation
- **Icons**: Lucide React for consistent iconography
- **Theme System**: Custom dark/light mode toggle with localStorage persistence and system preference detection

## Backend Architecture
- **Server**: Express.js 4.21.2 with ES modules
- **File Upload**: Multer with memory storage for handling multipart form data
- **API Design**: RESTful endpoints under `/api` prefix
- **CORS**: Enabled for cross-origin requests between frontend and backend
- **Environment Config**: dotenv for environment variable management

## Data Storage
- **Database**: MongoDB Atlas with connection string authentication
- **File Storage**: GridFS (GridFSBucket) for storing and retrieving large files
- **Database Name**: 'tugas_app' with 'uploads' bucket for GridFS

## Key Features
- **File Management**: Upload, download, and delete assignment files
- **File Metadata**: Track file size, content type, upload date, and deadlines
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Internationalization**: Indonesian language support throughout the interface

## Development Setup
- **Development Server**: Vite dev server on port 3000
- **API Proxy**: Vite proxy configuration redirecting `/api` calls to Express server on port 5000
- **Concurrent Development**: Setup for running both frontend and backend simultaneously
- **Path Aliases**: Custom path resolution for cleaner imports (@, @assets)

## Utility Functions
- **File Formatting**: Helper functions for file size, date formatting, and file type icons
- **API Client**: Centralized API calls with error handling
- **Deadline Management**: Date calculations for assignment due dates

# External Dependencies

## Core Runtime Dependencies
- **React Ecosystem**: React 19.1.1, React DOM, React Router DOM
- **Backend Framework**: Express.js with CORS middleware
- **Database**: MongoDB native driver with GridFS support

## Styling and UI
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent UI elements
- **clsx**: Utility for conditional CSS class names

## File Handling
- **Multer**: Multipart form data handling for file uploads
- **GridFS**: MongoDB's specification for storing large files

## Development Tools
- **Vite**: Fast build tool and development server
- **Autoprefixer**: CSS vendor prefix automation
- **Concurrently**: Tool for running multiple npm scripts simultaneously

## Configuration
- **Environment Variables**: dotenv for secure configuration management
- **MongoDB Atlas**: Cloud database service with connection string authentication
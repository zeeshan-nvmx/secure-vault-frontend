# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview built application
npm run preview
```

## Project Architecture

This is a React-based secure credential management frontend application built with Vite. The application uses zero-knowledge encryption architecture for storing sensitive information like API keys, env files, and secure notes.

### Core Structure

- **Authentication System**: JWT-based authentication with PIN verification for sensitive operations
- **State Management**: React Context (AuthContext) for user authentication state
- **API Layer**: Centralized API service class (`src/services/api.js`) handling all backend communication
- **Routing**: React Router with protected routes for authenticated areas

### Key Components

- `src/contexts/AuthContext.jsx` - Global authentication state management
- `src/services/api.js` - Centralized API service with token management
- `src/components/layout/ProtectedRoute.jsx` - Route protection wrapper
- `src/components/auth/` - Login/Register components
- `src/components/files/` - File management modals (upload, create notes, view)
- `src/components/common/PinModal.jsx` - PIN verification for sensitive operations

### API Integration

The application communicates with a backend API running on localhost:3000. The API service handles:
- Authentication (login, register, PIN verification)
- File operations (upload, download, create notes, delete)
- Password/PIN management

### Environment Configuration

- Uses Vite environment variables (`VITE_API_URL`)
- Default API URL: `http://localhost:3000/api`
- Vite dev server configured with API proxy to backend

### Security Features

- JWT token storage in localStorage with automatic cleanup
- PIN-based access control for file operations
- Encrypted file storage and retrieval
- Protected routes requiring authentication

### File Structure

- `src/components/` - React components organized by feature
- `src/contexts/` - React context providers
- `src/services/` - API and external service integrations
- `src/utils/` - Utility functions and helpers
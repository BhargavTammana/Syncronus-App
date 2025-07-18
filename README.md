# Syncronus Chat App

A modern, real-time chat application built with React, Node.js, and Socket.IO. Features include direct messaging, group channels, file sharing, emoji picker, and user authentication with profile management.

## 🚀 Features

### Authentication & Profile Management
- **User Registration & Login** - Secure authentication with JWT tokens
- **Profile Setup** - Customizable user profiles with avatars and color themes
- **Profile Image Upload** - Upload and manage profile pictures
- **Secure Logout** - Protected routes and session management

### Real-time Messaging
- **Direct Messages (DMs)** - One-on-one private conversations
- **Group Channels** - Create and participate in group conversations
- **Real-time Communication** - Instant message delivery using Socket.IO
- **Message History** - Persistent message storage and retrieval
- **Typing Indicators** - See when someone is typing

### Rich Media Support
- **File Sharing** - Upload and share documents, images, and other files
- **Image Preview** - In-chat image viewing with download options
- **File Download** - Download shared files with progress indicators
- **Emoji Picker** - Express yourself with a wide range of emojis

### User Interface
- **Modern Design** - Clean, responsive UI built with Tailwind CSS
- **Dark Theme** - Elegant dark mode interface
- **Contact Search** - Find and add new contacts easily
- **Avatar System** - Colorful avatar system with initials fallback
- **Responsive Layout** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Socket.IO Client** - Real-time communication
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Emoji Picker React** - Emoji selection component
- **Moment.js** - Date and time formatting
- **React Lottie** - Animations and loading states

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie parsing middleware

## 📁 Project Structure

```
Chat-App/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   │   ├── auth/      # Authentication pages
│   │   │   ├── chat/      # Chat interface
│   │   │   └── profile/   # Profile management
│   │   ├── context/       # React context providers
│   │   ├── store/         # Zustand state management
│   │   ├── lib/           # Utility functions and API client
│   │   └── utils/         # Constants and helpers
│   └── public/            # Static assets
├── server/                # Backend Node.js application
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middleware
│   ├── uploads/          # File upload storage
│   └── config/           # Configuration files
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BhargavTammana/Syncronus-App.git
   cd Chat-App
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the server directory:
   ```env
   PORT=3001
   MONGODB_URL=your_mongodb_connection_string
   JWT_KEY=your_jwt_secret_key
   ```

   Create a `.env.local` file in the client directory:
   ```env
   VITE_SERVER_URL=http://localhost:3001
   ```

### Running the Application

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 🔧 Configuration

### MongoDB Setup
- Local MongoDB: Install MongoDB locally and use connection string `mongodb://localhost:27017/syncronus-chat-app`
- MongoDB Atlas: Create a cluster and use the provided connection string

### Environment Variables

#### Server (.env)
```env
PORT=3001                              # Server port
MONGODB_URL=your_mongodb_url           # MongoDB connection string
JWT_KEY=your_secret_key               # JWT signing key
```

#### Client (.env.local)
```env
VITE_SERVER_URL=http://localhost:3001  # Backend server URL
```

## 📱 Usage

### Getting Started
1. **Sign Up** - Create a new account with email and password
2. **Profile Setup** - Complete your profile with name, avatar, and color theme
3. **Start Chatting** - Search for contacts or create channels to begin conversations

### Key Features Usage

#### Direct Messaging
- Search for users by email or name
- Click on a contact to start a conversation
- Send text messages, emojis, and files
- View message history and timestamps

#### Group Channels
- Create new channels with multiple members
- Add participants from your contacts
- Participate in group discussions
- Manage channel settings (admin only)

#### File Sharing
- Click the attachment icon to upload files
- Share images, documents, and other file types
- Preview images directly in chat
- Download shared files with progress tracking

#### Profile Management
- Update your profile information
- Change your avatar and color theme
- Manage privacy settings
- Logout securely

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user-info` - Get user information
- `POST /api/auth/update-profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Contacts
- `GET /api/contact/search` - Search contacts
- `GET /api/contact/get-contacts-for-dm` - Get DM contacts
- `GET /api/contact/get-all-contacts` - Get all contacts

### Messages
- `POST /api/messages/get-messages` - Get message history
- `POST /api/messages/upload-file` - Upload file attachment

### Channels
- `POST /api/channel/create-channel` - Create new channel
- `GET /api/channel/get-user-channels` - Get user's channels
- `GET /api/channel/get-channel-messages/:channelId` - Get channel messages

## 🔌 Socket Events

### Client to Server
- `sendMessage` - Send direct message
- `send-channel-message` - Send channel message

### Server to Client
- `receiveMessage` - Receive direct message
- `receive-channel-message` - Receive channel message

## 🎨 UI Components

The application uses a custom design system built with:
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Custom components** for chat-specific UI elements

### Key Components
- `MessageContainer` - Chat message display
- `MessageBar` - Message input and controls
- `ContactList` - Contact and channel listing
- `ProfileInfo` - User profile display
- `EmojiPicker` - Emoji selection interface

## 🚀 Deployment

### Frontend Deployment (Render/Vercel/Netlify)
1. Build the client application:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform
3. Update environment variables for production

### Backend Deployment (Render/Heroku)
1. Deploy the server directory
2. Set environment variables in your hosting platform
3. Ensure MongoDB connection is configured for production

### Production Environment Variables
```env
# Server
PORT=3001
MONGODB_URL=your_production_mongodb_url
JWT_KEY=your_production_jwt_key

# Client
VITE_SERVER_URL=your_production_server_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and Node.js communities for excellent documentation
- Socket.IO for real-time communication capabilities
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- All contributors who helped improve this project

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ by BhargavTammana**
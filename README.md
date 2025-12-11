# ✨ Full Stack Realtime Chat App ✨

Highlights:

- 🌟 Tech stack: PERN (PostgreSQL, Express, React, Node) + Socket.io + TailwindCSS + Daisy UI
- 🎃 Authentication && Authorization with JWT
- 👾 Real-time messaging with Socket.io
- 🚀 Online user status
- 👌 Global state management with Zustand
- 🐞 Error handling both on the server and on the client
- ⭐ At the end Deployment like a pro for FREE!
- ⏳ And much more!

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup PostgreSQL Database

1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE chat_app;
   ```
3. Note your PostgreSQL connection details (host, port, database name, username, password)

### Setup .env file

Create a `.env` file in the `backend` directory:

```js
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/chat_app
# Or use individual connection parameters:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=chat_app
# DB_USER=your_username
# DB_PASSWORD=your_password

# Server
PORT=5001
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Environment
NODE_ENV=development
```

**Note:** The `DATABASE_URL` format is: `postgresql://username:password@host:port/database_name`

### Install Dependencies

```shell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Database Setup

The database tables will be created automatically when you start the server. However, make sure PostgreSQL is running and the database exists.

### Seed Database (Optional)

To populate the database with sample users:

```shell
cd backend
node src/seeds/user.seed.js
```

This will create 15 sample users (8 female, 7 male) with the password `123456`.

### Build the app

```shell
npm run build
```

### Start the app

**Development mode:**

```shell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Production mode:**

```shell
npm start
```

### Testing the Migration

1. **Verify Database Connection:**
   - Start the backend server
   - Check console for "PostgreSQL connected successfully"
   - Check console for "Database tables created successfully"

2. **Test Authentication:**
   - Sign up a new user
   - Log in with credentials
   - Verify JWT token is set in cookies

3. **Test Messaging:**
   - Create two user accounts
   - Send messages between them
   - Verify real-time message delivery via Socket.io

4. **Test Online Status:**
   - Open app in multiple browser tabs/windows
   - Verify online status indicators work correctly

### Troubleshooting

**Database Connection Issues:**
- Ensure PostgreSQL is running: `pg_isready` or check service status
- Verify DATABASE_URL format: `postgresql://user:password@host:port/database`
- Check firewall settings if connecting to remote database

**Table Creation Errors:**
- Ensure you have CREATE TABLE permissions
- Check if tables already exist (they won't be recreated if they exist)

**Port Already in Use:**
- Change PORT in .env file
- Kill process using the port: `lsof -ti:5001 | xargs kill` (Mac/Linux)

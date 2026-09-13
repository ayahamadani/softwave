Softwave
A full-stack music streaming web application. Users sign up, browse and search a song library, build playlists, save liked songs, and play tracks through a persistent player that stays put while they move around the app. Administrators get a separate panel for uploading songs and managing users.

Built with React on the front end, Express and MongoDB on the back end, and AWS S3 for audio and image storage.
Features
Accounts and authentication

Registration and login with server-side validation
Passwords hashed with bcrypt, never stored in plain text
Session handling with JSON Web Tokens
Password reset by email, using a single-use token sent with Nodemailer
Protected routes on the client, so signed-out users cannot reach account pages

Music

Browse the full song library and search by name, artist or genre
Persistent bottom player that keeps playing across navigation, backed by React context
Like and unlike songs, with a dedicated liked songs page

Playlists

Create, rename and delete playlists
Add and remove songs
Custom playlist cover images, uploaded to S3

Profiles and administration

Profile page with avatar upload
Admin panel for uploading new songs with cover art, and for promoting or removing users
Role-based access, so the panel is only reachable by admin accounts
Tech stack
Layer
Technology
Front end
React 19, React Router 7, CSS Modules, Context API
Back end
Node.js, Express, Mongoose
Database
MongoDB
Auth
JSON Web Tokens, bcryptjs, express-validator
Storage
AWS S3, Multer
Email
Nodemailer
Logging
Morgan

Architecture
The project is split into two independently runnable applications.

softwave/
├── client/              React single-page application
│   └── src/
│       ├── components/  Navbar, BottomPlayer, AuthModal, Loader, ProtectedRoute
│       ├── context/     AuthModalContext, SongContext
│       └── pages/       Home, Login, Signup, Profile, Playlists,
│                        PlaylistDetail, LikedSongs, AdminPanel,
│                        ForgotPassword, ResetPassword
└── server/              Express REST API
    ├── config/          Database connection
    ├── models/          User, Song, Playlist, LikedSongs
    ├── routes/          auth, songs, playlists, likedsongs, upload
    └── util/            Email sending

The client talks to the API over REST. File uploads are handled entirely server-side: the browser posts a file to the API, which streams it to S3 with Multer and stores only the resulting URL in MongoDB. AWS credentials never reach the client.
Data model
User — username, email, hashed password, avatar URL, admin flag
Song — name, artist, genre, album cover URL, audio URL
Playlist — name, owner, song references, cover image
LikedSongs — one document per user, holding song references
API
Base path /.

Method
Route
Purpose
POST
/auth/signup
Create an account
POST
/auth/login
Sign in
GET
/auth/
List users (admin)
GET
/auth/:userId
Fetch a single user
PUT
/auth/:userId/makeAdmin
Promote a user
DELETE
/auth/:userId
Delete a user
POST
/auth/forgot-password
Send a reset link
POST
/auth/reset-password/:token
Set a new password
GET
/songs/
List all songs
GET
/songs/search
Search songs
POST
/songs/
Add a song
POST
/playlists/
Create a playlist
GET
/playlists/:playlistId
Fetch a playlist
GET
/playlists/user/:userId
List a user's playlists
PUT
/playlists/:playlistId/add
Add a song
PUT
/playlists/:playlistId/remove
Remove a song
DELETE
/playlists/:userId/:playlistId
Delete a playlist
GET
/likedsongs/:userId
List liked songs
POST
/likedsongs/:userId/:songId
Like a song
DELETE
/likedsongs/:userId/:songId
Unlike a song
POST
/upload/:userId/upload-avatar
Upload a profile picture
POST
/upload/:userId/upload-song
Upload audio and cover art
POST
/upload/:userId/:playlistId
Upload a playlist cover

Running it locally
You will need Node.js, a MongoDB database (Atlas or local), an AWS S3 bucket, and an SMTP account for password reset emails.

1. Clone and install

git clone https://github.com/ayahamadani/softwave.git
cd softwave

cd server && npm install
cd ../client && npm install

2. Configure the server

Create server/config/config.env:

NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=a_long_random_string

AWS_REGION=eu-north-1
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name

EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password

This file is gitignored and must never be committed.

3. Run

# terminal one
cd server && npm run dev      # API on http://localhost:5000

# terminal two
cd client && npm start        # client on http://localhost:3000
Notes and known limitations
The CORS origin in server/server.js is currently pinned to the deployed S3 site. Point it at http://localhost:3000 when developing locally.
There is no automated test suite yet.
Admin promotion is done directly through the API rather than through an invitation flow.
Why I built it
I wanted to build something end to end rather than a single-purpose demo: real accounts, real file handling, real access control, and the awkward parts that tutorials tend to skip, like password resets and keeping audio playing while the user navigates between pages.


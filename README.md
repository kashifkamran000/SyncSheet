
# SyncSheet
SyncSheet is a web application that Kashif is building using the MERN stack, designed for real-time collaborative document editing. It features real-time collaboration through Socket.io and React Query, allowing users to edit documents simultaneously and sync changes in real time. Users can share documents via links with customizable permissions (read-only or read/write) and must log in to access or edit documents. The editor uses Quill.js with support for custom toolbars, tables, emojis, and image resizing. Additionally, a notification system keeps users informed about document edits, invite status changes, and permission updates, even if the document isn't open. Harsh is also planning to integrate an AI chatbot into SyncSheet for providing real-time assistance to users, helping with tasks like document editing, answering questions, or guiding them through the features. The app’s design focuses on a clean, user-friendly interface with an off-white base color and seamless communication, ensuring smooth collaboration among users.


##  Table of Contents
- Features
- Technologies Used
- Environment Variables
- Installation
- Screenshots
- Acknowledgements

## Features
- Real-Time Collaboration: Multiple users can edit documents simultaneously, with changes syncing in real time.
- Document Sharing: Share documents with others using links and set permissions (read-only or read/write).
- Login Requirement: Users need to log in to access or edit documents.
- Notification System: Users are notified about document edits, invite status changes, and permission updates, even when the document isn't open.
- AI Chatbot Assistance: A chatbot will assist users in real time with document editing, answering questions, and guiding through features.
- User-Friendly Interface: A clean, intuitive design with easy navigation.

## Technologies Used
- Socket.io: Enables users to edit documents simultaneously with changes synced in real time.
- React Query: Manages data synchronization between users, ensuring document updates are reflected instantly.
- Authentication System: Secures document access by requiring users to log in before interacting with the app.
- Quill.js: Provides a rich text editor with features like custom toolbars, tables, emojis, and image resizing.
- AI-Powered Chatbot: Offers real-time help with document editing, answering questions, and guiding users through features.
- Redux: Global state management, particularly for handling logged-in user profiles and ensuring seamless transitions between app features.
- MongoDB: Stores user data, documents, and permission settings for efficient retrieval and management.
- Express.js: Handles HTTP requests and routes for SyncSheet's server-side logic.
- Node.js: Powers the server-side logic for handling requests, database interactions, and real-time communication.
- React: Provides a dynamic, component-based interface for building and managing user interactions within SyncSheet.
- Other: HTML, CSS, JavaScript

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Backend

`PORT`

`MONGO_URL`

`DB_NAME`

`ACCESS_TOKEN_SECRET`

`ACCESS_TOKEN_EXPIRY`

`REFRESH_TOKEN_SECRET`

`REFRESH_TOKEN_EXPIRY`

`CORS_ORIGIN`

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`

`GOOGLE_CLIENT_ID`

`GOOGLE_CLIENT_SECRET`

Frontend

`VITE_SERVER_URL`

`VITE_CLIENT_ID`

`VITE_PROJECT_ID`

`VITE_AUTH_URL`

`VITE_TOKEN_URL`

`VITE_CLIENT_SECRET`

`VITE_auth_provider_x509_cert_url`

## Installation

1. Clone the repository:

```bash
  git clone https://github.com/kashifkamran000/SyncSheet.git
  cd SyncSheet
```
2. Install dependencies:
   
Backend:
```bash
  cd backend
  npm install
```
Frontend:
```bash
  cd frontend
  npm install
```

3. Run the application:

Backend:
```bash
  npm run dev
```
Frontend:
```bash
  npm run dev
```


## Screensorts



Home Page:



<img width="1418" alt="Screenshot 2025-01-11 at 9 38 25 PM" src="https://github.com/user-attachments/assets/728fe4c2-2305-44e0-8e62-886771085c6d" />




Editor Page:




<img width="1414" alt="Screenshot 2025-01-11 at 9 39 10 PM" src="https://github.com/user-attachments/assets/9d508454-dc45-40a3-9365-5bcf28bfabd4" />




All Docs Page:




<img width="1418" alt="Screenshot 2025-01-11 at 9 38 39 PM" src="https://github.com/user-attachments/assets/8e0575b1-4050-4335-a926-35f76db72c37" />




AI Chat Bot:




<img width="1415" alt="Screenshot 2025-01-11 at 9 39 41 PM" src="https://github.com/user-attachments/assets/75c0a925-c4ac-4d74-b264-466cbc2f3773" />




Login Page: 




<img width="1415" alt="Screenshot 2025-01-11 at 9 44 01 PM" src="https://github.com/user-attachments/assets/2fb6f37d-d2de-4ccd-b16b-d85a2bb299a8" />




Signup Page: 




<img width="1415" alt="Screenshot 2025-01-11 at 9 44 13 PM" src="https://github.com/user-attachments/assets/41cce160-b683-4cdc-82a9-8adff9c24455" />




Dashboard Page: 




<img width="1413" alt="Screenshot 2025-01-11 at 9 38 56 PM" src="https://github.com/user-attachments/assets/d416d0a8-40eb-449c-9047-db6f428f3a63" />




## Acknowledgements

- Thankful to the open-source community for providing robust tools like MongoDB, Express.js, React, Node.js, Quill.js, and Socket.io.
- Cloudinary for media management and optimization tools.
- Redux Toolkit for simplifying state management.

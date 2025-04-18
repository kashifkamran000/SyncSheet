import connectDB from './db/index.db.js'
import dotenv from 'dotenv';
import { app, server } from './app.js'
import {cleanupExpiredInvitations} from './controllers/invitation.controllers.js'
import cron from 'node-cron';

dotenv.config({
    path: './.env'
})

// Schedule cleanup job 
const scheduleCleanupJob = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Starting scheduled invitation cleanup...');
        await cleanupExpiredInvitations();
    });
    
    console.log('Cleanup job scheduled');
  };

connectDB()
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
            scheduleCleanupJob();
            console.log(`Socket.IO is ready for connections`);
        })
    })
    .catch((error) => {
        console.log("Database connection error: ", error);
        process.exit(1);  
    })
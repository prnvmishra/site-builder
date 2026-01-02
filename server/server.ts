import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import { stripeWebhook } from './controllers/stripeWebhook.js';
import prisma from './lib/prisma.js';

const app = express();

const port = 3000;

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials: true,
}

app.use(cors(corsOptions))
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhook)

// Debug: Check if auth is properly imported
console.log('Auth handler loaded:', typeof auth);

// Test endpoint to verify auth handler works
app.get('/api/auth-test', (req, res) => {
    res.json({ message: 'Auth test endpoint works' });
});

// Temporary manual auth endpoints for testing
app.post('/api/auth/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists in database
        const user = await prisma.user.findUnique({
            where: { email }
        });
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // For now, just return success (real password check needed)
        res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/sign-up', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Create new user
        const newUser = await prisma.user.create({
            data: {
                id: crypto.randomUUID(),
                email,
                name,
                // In real app, hash password here
            }
        });
        
        res.json({ user: { id: newUser.id, email: newUser.email, name: newUser.name } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/delete-account', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }
        
        // Delete user and all related data in correct order
        await prisma.websiteProject.deleteMany({
            where: { userId }
        });
        
        await prisma.transaction.deleteMany({
            where: { userId }
        });
        
        await prisma.session.deleteMany({
            where: { userId }
        });
        
        await prisma.account.deleteMany({
            where: { userId }
        });
        
        await prisma.user.delete({
            where: { id: userId }
        });
        
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

app.get('/api/auth/session', (req, res) => {
    res.json({ user: null });
});

app.use('/api/auth', toNodeHandler(auth));

app.use(express.json({limit: '50mb'}))

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
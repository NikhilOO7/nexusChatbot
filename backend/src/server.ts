import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// MongoDB connection
const mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoClient.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { query, sessionId } = req.body;
        
        // Forward request to Python service
        const response = await axios.post(`${PYTHON_SERVICE_URL}/chat`, {
            query,
            session_id: sessionId
        });

        res.json(response.data);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Analytics endpoints
app.get('/api/analytics/common-intents', async (req, res) => {
    try {
        const db = mongoClient.db('chatbot');
        const analytics = await db.collection('chat_history')
            .aggregate([
                { $group: { _id: '$intent', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]).toArray();
        
        res.json(analytics);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
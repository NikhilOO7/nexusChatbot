# AI Customer Support Chatbot

A production-grade AI chatbot using GPT-4 and LangChain for automated customer support, featuring semantic retrieval with FAISS.

## Features

- Real-time chat interface with markdown support
- Semantic search using FAISS for contextually relevant answers
- Integration with MongoDB for chat history and analytics
- Sentiment analysis and response tracking
- Scalable microservices architecture

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js/Express + TypeScript
- AI Service: Python + LangChain + FAISS
- Database: MongoDB
- APIs: OpenAI GPT-4

## Prerequisites

- Node.js 16+
- Python 3.8+
- MongoDB
- OpenAI API key

## Setup

1. Clone the repository
2. Copy environment files:
   ```bash
   cp python-service/.env.example python-service/.env
   cp backend/.env.example backend/.env
   ```
3. Update the environment files with your credentials
4. Install dependencies:
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && npm install`
   - Python Service: `cd python-service && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`

## Development

Run all services in development mode:

```bash
./dev.sh
```

Or run services individually:

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
npm run dev
```

### Python Service
```bash
cd python-service
source venv/bin/activate
python chatbot_service.py
```

## Project Structure

```
├── frontend/           # React frontend
├── backend/           # Node.js API gateway
└── python-service/    # Python AI service with LangChain
```

## API Documentation

### Chat Endpoint
- POST `/api/chat`
  - Request: `{ "query": string, "sessionId": string }`
  - Response: `{ "response": string }`

### Analytics Endpoint
- GET `/api/analytics/common-intents`
  - Response: `[{ "_id": string, "count": number }]`
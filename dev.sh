#!/bin/bash

# Start Python service
cd python-service
source venv/bin/activate
pip install -r requirements.txt
python chatbot_service.py &

# Start Node.js backend
cd ../backend
npm install
npm run dev &

# Start React frontend
cd ../frontend
npm install
npm run dev &

# Wait for all background processes
wait
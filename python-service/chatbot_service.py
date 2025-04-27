from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import MongoDBChatMessageHistory, ConversationBufferMemory
import os
from dotenv import load_dotenv
from document_loader import DocumentProcessor
from sentiment_analyzer import SentimentAnalyzer

load_dotenv()

app = FastAPI()
document_processor = DocumentProcessor()
vector_store = document_processor.load_existing_index()
sentiment_analyzer = SentimentAnalyzer()

class ChatInput(BaseModel):
    query: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    sentiment: str

@app.on_event("startup")
async def startup_event():
    required_vars = ['OPENAI_API_KEY', 'MONGODB_URI']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        raise Exception(f"Missing required environment variables: {', '.join(missing_vars)}")

@app.post("/chat")
async def chat_endpoint(chat_input: ChatInput) -> ChatResponse:
    try:
        # Initialize chat model
        llm = ChatOpenAI(
            model_name=os.getenv('MODEL_NAME', 'gpt-4'),
            temperature=float(os.getenv('TEMPERATURE', '0.7'))
        )

        # Initialize MongoDB chat history
        message_history = MongoDBChatMessageHistory(
            connection_string=os.getenv('MONGODB_URI'),
            session_id=chat_input.session_id,
            database_name="chatbot",
            collection_name="chat_history"
        )

        # Initialize conversation memory
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            chat_memory=message_history,
            return_messages=True
        )

        # Initialize conversation chain
        conversation = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vector_store.as_retriever(
                search_kwargs={"k": 3}
            ),
            memory=memory,
            verbose=True
        )

        # Get response
        response = conversation({"question": chat_input.query})
        answer = response["answer"]
        
        # Analyze sentiment
        sentiment = sentiment_analyzer.analyze(answer)
        
        return ChatResponse(response=answer, sentiment=sentiment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
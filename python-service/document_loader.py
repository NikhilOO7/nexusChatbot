from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
import os
from dotenv import load_dotenv

load_dotenv()

class DocumentProcessor:
    def __init__(self, docs_dir="docs"):
        self.docs_dir = docs_dir
        self.embeddings = OpenAIEmbeddings()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

    def load_and_process_documents(self):
        """Load documents from directory and create FAISS index"""
        # Create docs directory if it doesn't exist
        if not os.path.exists(self.docs_dir):
            os.makedirs(self.docs_dir)
            # Create a sample FAQ file if directory is empty
            with open(f"{self.docs_dir}/sample_faq.txt", "w") as f:
                f.write("Sample FAQ content. Replace this with your actual FAQ documents.")

        # Load documents
        loader = DirectoryLoader(
            self.docs_dir,
            glob="**/*.txt",
            loader_cls=TextLoader
        )
        documents = loader.load()
        
        # Split documents into chunks
        texts = self.text_splitter.split_documents(documents)
        
        # Create and save FAISS index
        vectorstore = FAISS.from_documents(texts, self.embeddings)
        vectorstore.save_local("faiss_index")
        
        return vectorstore

    def load_existing_index(self):
        """Load existing FAISS index"""
        if os.path.exists("faiss_index"):
            return FAISS.load_local("faiss_index", self.embeddings)
        return self.load_and_process_documents()

if __name__ == "__main__":
    processor = DocumentProcessor()
    vectorstore = processor.load_and_process_documents()
    print("FAISS index created successfully")
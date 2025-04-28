import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Filter, Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { knowledgeApi } from '../../services/api';
import './Knowledge.css';

type CategoryType = {
  id: string;
  name: string;
  docCount: number;
};

type DocumentType = {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  category?: string;
};

export const Knowledge: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load categories and documents
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingCategories(true);
        setIsLoadingDocuments(true);
        setError(null);
        
        // Load categories
        const categoriesData = await knowledgeApi.getCategories();
        setCategories(categoriesData);
        setIsLoadingCategories(false);
        
        // Load documents
        const documentsData = await knowledgeApi.getDocuments();
        setDocuments(documentsData);
        setIsLoadingDocuments(false);
      } catch (err) {
        console.error('Error loading knowledge base data:', err);
        setError('Failed to load knowledge base data. Please try again.');
        setIsLoadingCategories(false);
        setIsLoadingDocuments(false);
      }
    };
    
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setSelectedFiles(fileList);
      
      // If a single file is selected, use its name as the default title
      if (fileList.length === 1) {
        const fileName = fileList[0].name.replace(/\.[^/.]+$/, ""); // Remove extension
        setNewDocTitle(fileName);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files);
      setSelectedFiles(fileList);
      
      // If a single file is selected, use its name as the default title
      if (fileList.length === 1) {
        const fileName = fileList[0].name.replace(/\.[^/.]+$/, ""); // Remove extension
        setNewDocTitle(fileName);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !newDocTitle) {
      setUploadError('Please select files and provide a title.');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    // Create a simulation interval for progress during actual upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) { // Stop at 95% and wait for actual completion
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('files', file));
      formData.append('title', newDocTitle);
      formData.append('description', newDocDescription || '');
      if (selectedCategory) {
        formData.append('category', selectedCategory);
      }
      
      const response = await knowledgeApi.uploadDocuments(formData);
      
      // Complete the progress to 100%
      clearInterval(interval);
      setUploadProgress(100);
      setUploadComplete(true);
      
      // Update our local state with the new document
      const newDoc: DocumentType = {
        id: response.documentId || Date.now().toString(),
        title: newDocTitle,
        description: newDocDescription || `Uploaded document (${selectedFiles.length} files)`,
        updatedAt: 'Just now',
        category: selectedCategory
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      
      // Update category count if needed
      if (selectedCategory) {
        setCategories(prev => prev.map(cat => 
          cat.id === selectedCategory 
            ? { ...cat, docCount: cat.docCount + 1 } 
            : cat
        ));
      }
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsUploading(false);
        setUploadComplete(false);
        setShowUploadModal(false);
        setSelectedFiles([]);
        setNewDocTitle('');
        setNewDocDescription('');
        setSelectedCategory('');
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      clearInterval(interval);
      setUploadError('Failed to upload documents. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="knowledge-container">
      <div className="search-bar">
        <div className="search-input-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search knowledge base..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="filter-button">
          <Filter size={18} />
          <span>Filters</span>
        </button>
        <button 
          className="upload-button"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload size={18} />
          <span>Upload</span>
        </button>
      </div>
      
      {error && (
        <div className="error-alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <div className="knowledge-content">
        {isLoadingCategories ? (
          <div className="loading-categories">
            <div className="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map(category => (
              <div key={category.id} className="category-card">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.docCount} documents</p>
                <button className="category-action">View Documents →</button>
              </div>
            ))}
            <div className="category-card add-category">
              <div className="add-icon-container">
                <Plus size={24} />
              </div>
              <h3 className="category-name">Add New Category</h3>
            </div>
          </div>
        )}
        
        <div className="recent-documents">
          <div className="section-header">
            <h2 className="section-title">
              {searchQuery ? 'Search Results' : 'Recently Updated Documents'}
            </h2>
            <button 
              className="add-document-button"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={16} />
              <span>Add Document</span>
            </button>
          </div>
          
          {isLoadingDocuments ? (
            <div className="loading-documents">
              <div className="loading-spinner"></div>
              <p>Loading documents...</p>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="documents-list">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="document-item">
                  <div className="document-info">
                    <h3 className="document-title">{doc.title}</h3>
                    <p className="document-description">{doc.description}</p>
                  </div>
                  <div className="document-meta">
                    <span className="document-updated">Updated {doc.updatedAt}</span>
                    <div className="document-actions">
                      <button className="document-action">Edit</button>
                      <button className="document-action">View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-documents">
              {searchQuery ? (
                <p>No documents found matching your search.</p>
              ) : (
                <p>No documents found. Upload your first document to get started.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Upload Documents</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  if (!isUploading) {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setNewDocTitle('');
                    setNewDocDescription('');
                    setSelectedCategory('');
                    setUploadError(null);
                  }
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {uploadError && (
                <div className="upload-error">
                  <AlertCircle size={16} />
                  <span>{uploadError}</span>
                </div>
              )}
              
              {!isUploading && !uploadComplete && (
                <>
                  <div 
                    className="file-drop-area"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={32} />
                    <p>Drag and drop files here, or click to browse</p>
                    <p className="file-types">Supports PDF, DOCX, TXT, CSV, XLSX</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      multiple
                      accept=".pdf,.docx,.txt,.csv,.xlsx"
                    />
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="selected-files">
                      <h3>Selected Files</h3>
                      <ul className="file-list">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="file-item">
                            <div className="file-info">
                              <File size={16} />
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button 
                              className="file-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                            >
                              <X size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="upload-form">
                    <div className="form-group">
                      <label htmlFor="docTitle">Document Title <span className="required">*</span></label>
                      <input
                        id="docTitle"
                        type="text"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        placeholder="Enter a title for your document"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="docDescription">Description (Optional)</label>
                      <textarea
                        id="docDescription"
                        value={newDocDescription}
                        onChange={(e) => setNewDocDescription(e.target.value)}
                        placeholder="Enter a brief description"
                        rows={3}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="docCategory">Category (Optional)</label>
                      <select
                        id="docCategory"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
              
              {isUploading && (
                <div className="upload-progress">
                  <h3>Uploading Files...</h3>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p>{uploadProgress}% Complete</p>
                </div>
              )}
              
              {uploadComplete && (
                <div className="upload-complete">
                  <CheckCircle size={48} className="success-icon" />
                  <h3>Upload Complete!</h3>
                  <p>Your documents have been successfully uploaded and are being processed.</p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-cancel"
                onClick={() => {
                  if (!isUploading) {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setNewDocTitle('');
                    setNewDocDescription('');
                    setSelectedCategory('');
                    setUploadError(null);
                  }
                }}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                className="modal-upload"
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0 || !newDocTitle}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import { Search, Plus, Filter } from 'lucide-react';
import './Knowledge.css';

export const Knowledge: React.FC = () => {
  const categories = [
    { id: 'account', name: 'Account Management', docCount: 15 },
    { id: 'billing', name: 'Billing & Payments', docCount: 23 },
    { id: 'technical', name: 'Technical Support', docCount: 47 },
    { id: 'product', name: 'Product Information', docCount: 32 },
    { id: 'returns', name: 'Returns & Refunds', docCount: 19 }
  ];

  const recentDocuments = [
    {
      id: '1',
      title: 'Mobile App Authentication Guide',
      description: 'Complete guide to resolving authentication issues in mobile applications.',
      updatedAt: '2 days ago'
    },
    {
      id: '2',
      title: 'Account Security Best Practices',
      description: 'Guidelines for maintaining account security and preventing unauthorized access.',
      updatedAt: '5 days ago'
    },
    {
      id: '3',
      title: 'Product Compatibility Matrix',
      description: 'Comprehensive list of compatible devices and operating systems.',
      updatedAt: '1 week ago'
    }
  ];

  return (
    <div className="knowledge-container">
      <div className="search-bar">
        <div className="search-input-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search knowledge base..." 
            className="search-input"
          />
        </div>
        <button className="filter-button">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>
      
      <div className="knowledge-content">
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
        
        <div className="recent-documents">
          <div className="section-header">
            <h2 className="section-title">Recently Updated Documents</h2>
            <button className="add-document-button">
              <Plus size={16} />
              <span>Add Document</span>
            </button>
          </div>
          
          <div className="documents-list">
            {recentDocuments.map(doc => (
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
        </div>
      </div>
    </div>
  );
};
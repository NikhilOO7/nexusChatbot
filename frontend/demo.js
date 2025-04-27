import React, { useState } from 'react';
import { MessageSquare, Send, FileText, BarChart2, Settings, User, List, Search } from 'lucide-react';

// Demo component for the AI Customer Support Chatbot
const ChatbotDemo = () => {
  const [activeSection, setActiveSection] = useState('chat');
  const [messages, setMessages] = useState([
    { id: 1, content: 'Hello! I\'m your AI customer support assistant. How can I help you today?', isUser: false, timestamp: '10:30 AM', sentiment: 'positive' },
    { id: 2, content: 'I\'m having trouble connecting my account to the mobile app. It keeps saying "authentication failed".', isUser: true, timestamp: '10:31 AM' },
    { id: 3, content: 'I understand you\'re having trouble with the mobile app authentication. Based on our documentation, this often happens when:\n\n1. Your password was recently changed\n2. You\'re using an outdated version of the app\n\nCould you verify which app version you\'re using?', isUser: false, timestamp: '10:31 AM', sentiment: 'neutral' },
    { id: 4, content: 'I\'m using version 2.3.0', isUser: true, timestamp: '10:32 AM' },
    { id: 5, content: 'Thank you for checking. The current version is 2.4.1. The authentication issue you\'re experiencing was fixed in version 2.3.5.\n\nI recommend updating your app through the App Store or Google Play Store. After updating, please try logging in again.\n\nWould you like me to provide step-by-step instructions for updating?', isUser: false, timestamp: '10:32 AM', sentiment: 'positive' }
  ]);
  
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const knowledgeCategories = [
    { id: 'account', name: 'Account Management', docCount: 15 },
    { id: 'billing', name: 'Billing & Payments', docCount: 23 },
    { id: 'technical', name: 'Technical Support', docCount: 47 },
    { id: 'product', name: 'Product Information', docCount: 32 },
    { id: 'returns', name: 'Returns & Refunds', docCount: 19 }
  ];
  
  const analytics = {
    totalConversations: 1254,
    avgSatisfactionScore: 4.2,
    commonQueries: [
      { query: 'Reset password', count: 187 },
      { query: 'Billing issues', count: 143 },
      { query: 'Product compatibility', count: 112 },
      { query: 'Return process', count: 95 },
      { query: 'Account activation', count: 82 }
    ],
    sentimentBreakdown: {
      positive: 64,
      neutral: 30,
      negative: 6
    }
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setShowSuggestions(false);
    
    // Simulate bot thinking
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        content: "I've looked at our documentation and found that updating the app should resolve your authentication issue. The latest version (2.4.1) includes several security improvements that address this specific problem.\n\nAfter you update, your login credentials should work without any issues. If you continue to experience problems, you might need to clear the app cache or reinstall the application completely.\n\nIs there anything else you'd like to know?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        sentiment: 'positive'
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setShowSuggestions(true);
    }, 1500);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-16 bg-indigo-800 flex flex-col items-center py-6">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-800 font-bold mb-8">
          AI
        </div>
        <div className="flex flex-col space-y-8 items-center flex-1">
          <button 
            className={`p-2 rounded-lg ${activeSection === 'chat' ? 'bg-indigo-700 text-white' : 'text-indigo-300 hover:bg-indigo-700 hover:text-white'}`}
            onClick={() => setActiveSection('chat')}
          >
            <MessageSquare size={24} />
          </button>
          <button 
            className={`p-2 rounded-lg ${activeSection === 'knowledge' ? 'bg-indigo-700 text-white' : 'text-indigo-300 hover:bg-indigo-700 hover:text-white'}`}
            onClick={() => setActiveSection('knowledge')}
          >
            <FileText size={24} />
          </button>
          <button 
            className={`p-2 rounded-lg ${activeSection === 'analytics' ? 'bg-indigo-700 text-white' : 'text-indigo-300 hover:bg-indigo-700 hover:text-white'}`}
            onClick={() => setActiveSection('analytics')}
          >
            <BarChart2 size={24} />
          </button>
          <button 
            className={`p-2 rounded-lg ${activeSection === 'settings' ? 'bg-indigo-700 text-white' : 'text-indigo-300 hover:bg-indigo-700 hover:text-white'}`}
            onClick={() => setActiveSection('settings')}
          >
            <Settings size={24} />
          </button>
        </div>
        <div className="mt-auto mb-4">
          <button className="p-2 rounded-lg text-indigo-300 hover:bg-indigo-700 hover:text-white">
            <User size={24} />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 shadow-sm flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            {activeSection === 'chat' && 'Chat Support'}
            {activeSection === 'knowledge' && 'Knowledge Base'}
            {activeSection === 'analytics' && 'Analytics Dashboard'}
            {activeSection === 'settings' && 'Settings'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <List size={20} />
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              New Conversation
            </button>
          </div>
        </header>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {activeSection === 'chat' && (
            <div className="flex h-full">
              {/* Chat area */}
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                          message.isUser 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white shadow rounded-bl-none'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <div className={`text-xs mt-1 flex justify-between items-center ${message.isUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                          <span>{message.timestamp}</span>
                          {!message.isUser && message.sentiment && (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              message.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 
                              message.sentiment === 'negative' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {message.sentiment}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Suggested responses */}
                {showSuggestions && (
                  <div className="bg-white p-3 border-t border-gray-200">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 whitespace-nowrap hover:bg-gray-200">
                        How do I update the app?
                      </button>
                      <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 whitespace-nowrap hover:bg-gray-200">
                        What if updating doesn't work?
                      </button>
                      <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 whitespace-nowrap hover:bg-gray-200">
                        I need more help
                      </button>
                      <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 whitespace-nowrap hover:bg-gray-200">
                        Contact human support
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Input area */}
                <div className="bg-white p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Context panel */}
              <div className="w-72 bg-white border-l border-gray-200 hidden md:block p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800">Conversation Details</h3>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Settings size={16} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Session Info</h4>
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Session ID:</span>
                      <span className="text-gray-900">a782f5c3-8d</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">5m 12s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">User Type:</span>
                      <span className="text-gray-900">Registered</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Related Articles</h4>
                  <div className="space-y-2">
                    <a href="#" className="block p-2 hover:bg-gray-50 rounded text-sm text-indigo-600 hover:text-indigo-800">
                      How to update your mobile app
                    </a>
                    <a href="#" className="block p-2 hover:bg-gray-50 rounded text-sm text-indigo-600 hover:text-indigo-800">
                      Common authentication issues
                    </a>
                    <a href="#" className="block p-2 hover:bg-gray-50 rounded text-sm text-indigo-600 hover:text-indigo-800">
                      Troubleshooting connection problems
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Current User</h4>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                      JD
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">John Doe</div>
                      <div className="text-xs text-gray-500">Customer since Mar 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'knowledge' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search knowledge base..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                      <Search size={18} />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {knowledgeCategories.map(category => (
                    <div key={category.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-lg mb-2 text-gray-800">{category.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {category.docCount} documents
                      </p>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        View Documents →
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-medium mb-4 text-gray-800">Recently Updated Documents</h2>
                  <div className="divide-y">
                    <div className="py-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-indigo-600">Mobile App Authentication Guide</h3>
                        <span className="text-xs text-gray-500">Updated 2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Complete guide to resolving authentication issues in mobile applications.</p>
                    </div>
                    <div className="py-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-indigo-600">Account Security Best Practices</h3>
                        <span className="text-xs text-gray-500">Updated 5 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Guidelines for maintaining account security and preventing unauthorized access.</p>
                    </div>
                    <div className="py-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-indigo-600">Product Compatibility Matrix</h3>
                        <span className="text-xs text-gray-500">Updated 1 week ago</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Comprehensive list of compatible devices and operating systems.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'analytics' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-gray-500 text-sm mb-1">Total Conversations</h3>
                    <div className="text-2xl font-semibold text-gray-800">{analytics.totalConversations}</div>
                    <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-gray-500 text-sm mb-1">Avg. Satisfaction Score</h3>
                    <div className="text-2xl font-semibold text-gray-800">{analytics.avgSatisfactionScore}/5</div>
                    <div className="text-xs text-green-600 mt-1">+0.3 from last month</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-gray-500 text-sm mb-1">Response Sentiment</h3>
                    <div className="flex items-end space-x-2 mt-2">
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-8 bg-green-500 rounded-t"></div>
                        <div className="text-xs mt-1 text-gray-600">{analytics.sentimentBreakdown.positive}%</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-8 bg-gray-400 rounded-t"></div>
                        <div className="text-xs mt-1 text-gray-600">{analytics.sentimentBreakdown.neutral}%</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-8 bg-red-500 rounded-t"></div>
                        <div className="text-xs mt-1 text-gray-600">{analytics.sentimentBreakdown.negative}%</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4 text-gray-800">Most Common Queries</h2>
                    <div className="space-y-4">
                      {analytics.commonQueries.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-gray-800 font-medium">{index + 1}.</span>
                            <span className="ml-2 text-gray-700">{item.query}</span>
                          </div>
                          <span className="text-gray-500 text-sm">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4 text-gray-800">Response Time</h2>
                    <div className="h-48 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-3xl font-bold text-indigo-600">1.8s</div>
                        <div className="mt-2">Average response time</div>
                        <div className="text-sm text-green-600 mt-1">23% faster than target</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4 text-gray-800">Knowledge Gap Analysis</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Integration with third-party apps</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              Insufficient Docs
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                            <a href="#">Create Document</a>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Enterprise licensing options</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">37</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              Missing Info
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                            <a href="#">Create Document</a>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Password reset process</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">28</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Well Documented
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            No Action Needed
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'settings' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">AI Model Settings</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>GPT-4</option>
                        <option>GPT-3.5-Turbo</option>
                        <option>Claude 3 Opus</option>
                        <option>Claude 3 Sonnet</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">Select the AI model to use for generating responses.</p>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature
                      </label>
                      <input type="range" min="0" max="1" step="0.1" value="0.7" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>More Precise (0)</span>
                        <span>0.7</span>
                        <span>More Creative (1)</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Context Length
                      </label>
                      <div className="flex items-center space-x-2">
                        <input type="number" value="5" min="1" max="20" className="w-20 p-2 border border-gray-300 rounded-md" />
                        <span className="text-gray-700">messages</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Number of previous messages to include for context.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">Knowledge Base Settings</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-indigo-600" checked />
                        <span className="ml-2 text-gray-700">Auto-update index when documents change</span>
                      </label>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Results
                      </label>
                      <div className="flex items-center space-x-2">
                        <input type="number" value="3" min="1" max="10" className="w-20 p-2 border border-gray-300 rounded-md" />
                        <span className="text-gray-700">documents</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Number of documents to retrieve per query.</p>
                    </div>
                    
                    <div className="mb-6">
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                        Rebuild Search Index
                      </button>
                      <p className="mt-1 text-xs text-gray-500">Last indexed: 2 hours ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">Integration Settings</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OpenAI API Key
                      </label>
                      <input type="password" value="sk-••••••••••••••••••••••" className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MongoDB Connection
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-green-600 text-sm">Connected</span>
                      </div>
                    </div>
                    
                    <div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotDemo;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Database, BarChart2, Clock, Shield, ChevronRight } from 'lucide-react';
import './LandingPage.css';
import ChatBotBanner from './../../assets/chatbot.png';

export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to signup with email pre-filled
    window.location.href = `/signup?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <nav className="landing-nav">
            <div className="logo">
              <span className="logo-icon">AI</span>
              <span className="logo-text">Support Bot</span>
            </div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#demo">Demo</a>
              <a href="#pricing">Pricing</a>
              <div className="auth-buttons">
                <Link to="/login" className="login-button">Log In</Link>
                <Link to="/signup" className="signup-button">Sign Up</Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Intelligent Customer <br />Support</h1>
            <h2>Powered by AI</h2>
            <p>
              Our AI-powered chatbot helps you provide 24/7 customer support,
              reducing response times and improving customer satisfaction.
            </p>
            <form onSubmit={handleSubmit} className="cta-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Get Started</button>
            </form>
          </div>
          <div className="hero-image">
            <img src={ChatBotBanner} alt="AI Chatbot Interface" />
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <MessageSquare size={24} />
              </div>
              <h3>Contextual Conversations</h3>
              <p>Our AI understands context and maintains coherent conversations with your customers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Database size={24} />
              </div>
              <h3>Knowledge Base Integration</h3>
              <p>Connect your documentation and FAQs for accurate, consistent responses.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart2 size={24} />
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Track customer satisfaction, common queries, and identify knowledge gaps.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={24} />
              </div>
              <h3>24/7 Availability</h3>
              <p>Provide instant responses at any time, reducing wait times and improving satisfaction.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={24} />
              </div>
              <h3>Secure & Private</h3>
              <p>Enterprise-grade security with end-to-end encryption and data privacy compliance.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="demo">
        <div className="container">
          <h2>See It In Action</h2>
          <div className="demo-container">
            <div className="demo-chat">
              <div className="demo-message bot">
                <p>Hello! I'm your AI customer support assistant. How can I help you today?</p>
              </div>
              <div className="demo-message user">
                <p>I'm having trouble connecting my account to the mobile app.</p>
              </div>
              <div className="demo-message bot">
                <p>I understand you're having trouble with the mobile app connection. This is usually caused by one of these issues:</p>
                <ul>
                  <li>Outdated app version</li>
                  <li>Incorrect login credentials</li>
                  <li>Server connectivity problems</li>
                </ul>
                <p>Could you tell me which version of the app you're using?</p>
              </div>
            </div>
            <div className="demo-info">
              <h3>Intelligent Support</h3>
              <p>Our AI chatbot uses advanced natural language processing to understand customer queries and provide helpful, accurate responses.</p>
              <ul className="demo-features">
                <li>
                  <ChevronRight size={16} />
                  <span>Contextual understanding</span>
                </li>
                <li>
                  <ChevronRight size={16} />
                  <span>Document-based responses</span>
                </li>
                <li>
                  <ChevronRight size={16} />
                  <span>Seamless human handoff</span>
                </li>
                <li>
                  <ChevronRight size={16} />
                  <span>Multi-language support</span>
                </li>
              </ul>
              <Link to="/signup" className="demo-cta">Try it Yourself</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <div className="container">
          <h2>Simple, Transparent Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Starter</h3>
                <div className="pricing-amount">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-number">49</span>
                  <span className="pricing-period">/month</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>1,000 AI responses per month</li>
                <li>Basic knowledge base (10 documents)</li>
                <li>Email support</li>
                <li>1 team member</li>
              </ul>
              <Link to="/signup?plan=starter" className="pricing-cta">Get Started</Link>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-badge">Popular</div>
              <div className="pricing-header">
                <h3>Professional</h3>
                <div className="pricing-amount">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-number">99</span>
                  <span className="pricing-period">/month</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>5,000 AI responses per month</li>
                <li>Advanced knowledge base (50 documents)</li>
                <li>Priority email & chat support</li>
                <li>5 team members</li>
                <li>Analytics dashboard</li>
              </ul>
              <Link to="/signup?plan=professional" className="pricing-cta">Get Started</Link>
            </div>
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="pricing-amount">
                  <span className="pricing-text">Custom</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>Unlimited AI responses</li>
                <li>Custom knowledge base integration</li>
                <li>24/7 dedicated support</li>
                <li>Unlimited team members</li>
                <li>Advanced analytics & reporting</li>
                <li>Custom AI model training</li>
              </ul>
              <Link to="/contact" className="pricing-cta outline">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">AI</span>
                <span className="logo-text">Support Bot</span>
              </div>
              <p>Intelligent customer support powered by artificial intelligence.</p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#demo">Demo</a></li>
                <li><Link to="/docs">Documentation</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 AI Support Bot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
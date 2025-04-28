import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validators, validateForm } from '../../utils/validation';
import './Auth.css';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({
    email: null,
    password: null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    
    // Clear errors when the user starts typing
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  const validateLoginForm = () => {
    const validationRules = {
      email: [validators.required, validators.email],
      password: [validators.required]
    };
    
    const errors = validateForm(formData, validationRules);
    setFormErrors(errors);
    
    // Form is valid if there are no errors
    return !Object.values(errors).some(error => error !== null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateLoginForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      
      // Redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">AI</span>
              <span className="logo-text">Support Bot</span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>
          
          {error && (
            <div className="auth-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                disabled={isLoading}
                className={formErrors.email ? 'input-error' : ''}
                required
              />
              {formErrors.email && (
                <div className="field-error">{formErrors.email}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  disabled={isLoading}
                  className={formErrors.password ? 'input-error' : ''}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formErrors.password && (
                <div className="field-error">{formErrors.password}</div>
              )}
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            
            <div className="form-group">
              <button
                type="submit"
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="auth-separator">
            <span>OR</span>
          </div>
          
          <button className="social-auth-button">
            <img src="/images/google-icon.svg" alt="Google" />
            <span>Sign in with Google</span>
          </button>
          
          <div className="auth-footer">
            <p>
              Don't have an account yet?{' '}
              <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
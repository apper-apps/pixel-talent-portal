import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'VA',
    company: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const roles = [
    { value: 'VA', label: 'Virtual Assistant (VA)' },
    { value: 'Company', label: 'Company Representative' },
    { value: 'Internal', label: 'Internal Admin (TalentFuze)' }
  ];

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignup) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (formData.role === 'Company' && !formData.company.trim()) {
        newErrors.company = 'Company name is required';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          company: formData.role === 'Company' ? formData.company : null
        });
        toast.success('Account created successfully! Welcome aboard!');
      } else {
        await login(formData.email, formData.password);
        toast.success('Welcome back! Login successful.');
      }
    } catch (error) {
      toast.error(error.message || `${isSignup ? 'Account creation' : 'Login'} failed`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      role: 'VA',
      company: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Users" size={32} className="text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-primary-100">
              {isSignup 
                ? 'Join TalentFuze and select your role' 
                : 'Sign in to access your dashboard'
              }
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <FormField
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={errors.name}
                  placeholder="Enter your full name"
                />
              )}

              <FormField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={errors.email}
                placeholder="Enter your email address"
              />

              <FormField
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                error={errors.password}
                placeholder="Enter your password"
              />

              {isSignup && (
                <>
                  <FormField
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Your Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={handleChange('role')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.role === 'Company' && (
                    <FormField
                      label="Company Name"
                      value={formData.company}
                      onChange={handleChange('company')}
                      error={errors.company}
                      placeholder="Enter your company name"
                    />
                  )}
                </>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isSignup ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignup ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {isSignup 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Create one"
                }
              </button>
            </div>
          </div>
        </div>

        {/* Role Info */}
        {isSignup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-white rounded-lg border border-gray-200 p-4"
          >
            <h3 className="font-medium text-gray-900 mb-3">Role Information:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <ApperIcon name="UserCheck" size={16} className="mr-2 mt-0.5 text-green-600" />
                <div>
                  <strong>Virtual Assistant:</strong> Manage job postings, applications, and candidate communications
                </div>
              </div>
              <div className="flex items-start">
                <ApperIcon name="Building2" size={16} className="mr-2 mt-0.5 text-blue-600" />
                <div>
                  <strong>Company Representative:</strong> Access client dashboard and track recruitment progress
                </div>
              </div>
              <div className="flex items-start">
                <ApperIcon name="Shield" size={16} className="mr-2 mt-0.5 text-purple-600" />
                <div>
                  <strong>Internal Admin:</strong> Full system access and administrative controls
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
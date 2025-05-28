import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2,AlertCircle, CheckCircle  } from 'lucide-react';

const LoginRegister = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message,setMessage] = useState({type : '',text : ""})
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    user_email: '',
    password: '',
    company_name: '',
    pass_key: ''
  });

  const API_BASE_URL = 'http://127.0.0.1:8000'

  const showMessage = (type,text) =>{
    setMessage({type,text})
    setTimeout(() => setMessage({type: "",text:""}),5000)
  }

const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        
        const tokens = {
        
          access_token : localStorage.setItem('access_token',data.access_token),
          refresh_token : localStorage.setItem('refresh_token',data.refresh_token),
          token_type : localStorage.setItem('token_type',data.token_type)

        };
        
        showMessage('success', 'Login successful!');
        console.log('Login successful:', { tokens, user: data });
        navigate("/")
        
        
      } else {
        showMessage('error', data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage('error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Registration successful! You can now login.');
        console.log('Registration successful:', data);
        
        setRegisterData({
          name: '',
          user_email: '',
          password: '',
          company_name: '',
          pass_key: ''
        });
        setActiveTab('login');
        
      } else {
        showMessage('error', data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome to Shopperr
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The B2B eCommerce platform for your business needs
            </p>
          </div>

          {/* Mesage dispaly */}
         {message.text && (
            <div className={`flex items-center p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Tab Container */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Tab Navigation */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'login'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'register'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="user_email"
                    value={loginData.user_email}
                    onChange={handleLoginChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLoginSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>


              </div>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <div className="space-y-4">
               
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={registerData.company_name}
                      onChange={handleRegisterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                

                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    name="user_email"
                    value={registerData.user_email}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                                <div>
                  <label htmlFor="pass_key" className="block text-sm font-medium text-gray-700 mb-1">
                    Pass Key
                  </label>
                  <input
                    type="text"
                    id="pass_key"
                    name="pass_key"
                    value={registerData.pass_key}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your pass key"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="register-password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                </div>



                <button
                  type="button"
                  onClick={handleRegisterSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                  {isLoading ? 'Registering...' : 'Register'}
                </button>


              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-blue-800 to-indigo-900 text-white items-center justify-center p-8">
        <div className="max-w-lg space-y-8">
          <h1 className="text-4xl font-bold">Shopperr Business</h1>
          <p className="text-xl">
            The premier B2B marketplace for businesses of all sizes. Get bulk
            discounts, exclusive deals, and personalized recommendations.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 text-green-400">✓</span>
              <span>Quantity-based pricing with bulk discounts</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">✓</span>
              <span>Business-exclusive deals and offers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">✓</span>
              <span>Intelligent product recommendations</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">✓</span>
              <span>Dedicated account manager for large orders</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
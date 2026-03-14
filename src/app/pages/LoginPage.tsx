import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'sonner';
import { Shield, User } from 'lucide-react';

type LoginRole = 'admin' | 'customer';

export function LoginPage() {
  const [activeRole, setActiveRole] = useState<LoginRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (role: LoginRole) => {
    setActiveRole(role);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login(email, password);
      await login(data.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = activeRole === 'admin';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Role Tabs */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleRoleSwitch('customer')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border-2 ${
              !isAdmin
                ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-200'
                : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            <User className="w-5 h-5" />
            Login as Customer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border-2 ${
              isAdmin
                ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200'
                : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600'
            }`}
          >
            <Shield className="w-5 h-5" />
            Login as Admin
          </button>
        </div>

        {/* Login Form */}
        <div className={`bg-white p-8 rounded-xl shadow-lg border-t-4 transition-colors duration-300 ${isAdmin ? 'border-purple-600' : 'border-orange-600'}`}>
          <div className="mb-6">
            <h2 className="text-center text-2xl font-extrabold text-gray-900">
              {isAdmin ? 'Admin Login' : 'Customer Login'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              {isAdmin
                ? 'Enter your admin credentials to access the dashboard'
                : 'Enter your credentials to start ordering'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm ${isAdmin ? 'focus:ring-purple-600' : 'focus:ring-orange-600'}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm ${isAdmin ? 'focus:ring-purple-600' : 'focus:ring-orange-600'}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isAdmin
                  ? 'bg-purple-600 hover:bg-purple-500'
                  : 'bg-orange-600 hover:bg-orange-500'
              }`}
            >
              {loading ? 'Signing in...' : `Sign in as ${isAdmin ? 'Admin' : 'Customer'}`}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

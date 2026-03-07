import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'sonner';
import { Shield, User } from 'lucide-react';

const DEMO_ACCOUNTS = {
  admin: {
    email: 'haykalharahap@gmail.com',
    password: 'qwerty123',
    label: 'Admin',
    icon: Shield,
    description: 'Full access to admin panel',
    gradient: 'from-amber-500 to-orange-600',
    hoverGradient: 'hover:from-amber-600 hover:to-orange-700',
    ring: 'focus-visible:outline-amber-500',
  },
  user: {
    email: 'user@gmail.com',
    password: 'qwerty123',
    label: 'User',
    icon: User,
    description: 'Browse menu & order food',
    gradient: 'from-blue-500 to-indigo-600',
    hoverGradient: 'hover:from-blue-600 hover:to-indigo-700',
    ring: 'focus-visible:outline-blue-500',
  },
};

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleDemoLogin = async (role: 'admin' | 'user') => {
    const account = DEMO_ACCOUNTS[role];
    setDemoLoading(role);
    setEmail(account.email);
    setPassword(account.password);
    try {
      const data = await api.login(account.email, account.password);
      await login(data.token);
      toast.success(`Logged in as ${account.label}!`);
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (error: any) {
      toast.error(error.message || 'Demo login failed');
    } finally {
      setDemoLoading(null);
    }
  };

  const isAnyLoading = loading || demoLoading !== null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md sm:rounded-t-md sm:rounded-b-none border-0 py-2.5 sm:py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-orange-600 text-sm sm:text-sm leading-6"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-md sm:rounded-b-md sm:rounded-t-none border-0 py-2.5 sm:py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-orange-600 text-sm sm:text-sm leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isAnyLoading}
              className="group relative flex w-full justify-center rounded-md bg-orange-600 px-3 py-2.5 sm:py-2 text-sm font-semibold text-white hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Demo Quick Login Section */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500 font-medium">Demo Account</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(DEMO_ACCOUNTS) as Array<'admin' | 'user'>).map((role) => {
            const account = DEMO_ACCOUNTS[role];
            const Icon = account.icon;
            return (
              <button
                key={role}
                onClick={() => handleDemoLogin(role)}
                disabled={isAnyLoading}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl bg-gradient-to-br ${account.gradient} ${account.hoverGradient} px-4 py-4 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${account.ring} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {demoLoading === role ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
                <span className="text-sm font-bold">
                  {demoLoading === role ? 'Logging in...' : `Login as ${account.label}`}
                </span>
                <span className="text-[11px] text-white/80 font-normal">
                  {account.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

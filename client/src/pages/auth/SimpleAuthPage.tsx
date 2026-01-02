import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { signIn, signUp } from '../../lib/api-client';

export default function SimpleAuthPage() {
  const { pathname } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isSignUp = pathname === '/sign-up';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      navigate('/projects');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 flex flex-col justify-center items-center h-[80vh]">
      <div className="w-full max-w-md bg-black/10 ring ring-indigo-900 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          )}
          
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <a 
            href={isSignUp ? '/sign-in' : '/sign-up'}
            className="text-indigo-400 hover:text-indigo-300 ml-1"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </a>
        </div>
      </div>
    </main>
  );
}

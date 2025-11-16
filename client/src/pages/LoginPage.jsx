import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const user = await login(email, password);
        if (user) navigate('/');
        else setError('Invalid email or password.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-md w-full p-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl space-y-8">
                <h2 className="text-center text-3xl font-extrabold">Sign in to your account</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <Input id="email" label="Email address" type="email"
                        required value={email} onChange={e => setEmail(e.target.value)} />

                    <Input id="password" label="Password" type="password"
                        required value={password} onChange={e => setPassword(e.target.value)} />

                    <Button type="submit" className="w-full" isLoading={loading}>Sign in</Button>
                </form>

                <p className="text-center text-sm">
                    Don't have an account? <Link to="/signup" className="text-indigo-600">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
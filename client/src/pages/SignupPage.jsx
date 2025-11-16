import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const { signup, loading } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (formData.name.length < 20 || formData.name.length > 60) {
            newErrors.name = 'Name must be between 20 and 60 characters.';
        }

        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        }

        if (formData.address.length > 400) {
            newErrors.address = 'Address cannot exceed 400 characters.';
        }

        if (!/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9a-zA-Z]).{8,16}$/.test(formData.password)) {
            newErrors.password =
                'Password must be 8-16 characters, with one uppercase letter and one special character.';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (validate()) {
            const user = await signup({
                name: formData.name,
                email: formData.email,
                address: formData.address,
                password: formData.password
            });

            if (user) {
                navigate('/');
            } else {
                setApiError('An account with this email already exists.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h2 className="text-center text-3xl font-bold">Create your account</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}

                    <Input
                        id="name"
                        name="name"
                        label="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                    />

                    <Input
                        id="email"
                        name="email"
                        label="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />

                    <Input
                        id="address"
                        name="address"
                        label="Address"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                        required
                    />

                    <Input
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />

                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign up
                    </Button>
                </form>

                <p className="text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;



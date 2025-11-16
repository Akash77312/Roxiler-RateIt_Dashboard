

import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

const ProfilePage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9a-zA-Z]).{8,16}$/.test(formData.newPassword)) {
            newErrors.newPassword =
                'New password must be 8-16 characters, with one uppercase and one special character.';
        }

        if (formData.newPassword !== formData.confirmPassword) {
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
        setMessage('');

        if (user && validate()) {
            setLoading(true);

            const success = await apiService.updatePassword(
                user.id,
                formData.currentPassword,
                formData.newPassword
            );

            if (success) {
                setMessage('Password updated successfully!');
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setErrors({ currentPassword: 'Current password is incorrect.' });
            }

            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-xl">
                <h1 className="text-2xl font-bold mb-6">Update Your Profile</h1>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold">User Details</h2>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && <p className="text-green-500">{message}</p>}

                    <Input
                        id="currentPassword"
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        error={errors.currentPassword}
                        required
                    />

                    <Input
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                        required
                    />

                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                    />

                    <Button type="submit" isLoading={loading}>
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;

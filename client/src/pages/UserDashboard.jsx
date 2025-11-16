import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const UserDashboard = () => {
    const { user } = useAuth();
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState({ name: '', address: '' });
    const [selectedStore, setSelectedStore] = useState(null);
    const [rating, setRating] = useState(0);

    const fetchStores = useCallback(async () => {
        if (user) {
            const data = await apiService.getStoresForUser(user.id);
            setStores(data);
        }
    }, [user]);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const filteredStores = useMemo(() => {
        return stores.filter(store =>
            store.name.toLowerCase().includes(search.name.toLowerCase()) &&
            store.address.toLowerCase().includes(search.address.toLowerCase())
        );
    }, [stores, search]);

    const handleOpenRatingModal = (store) => {
        setSelectedStore(store);
        setRating(store.userRating || 0);
    };

    const handleCloseRatingModal = () => {
        setSelectedStore(null);
        setRating(0);
    };

    const handleRatingSubmit = async () => {
        if (user && selectedStore) {
            await apiService.submitRating(user.id, selectedStore.id, rating);
            fetchStores(); 
            handleCloseRatingModal();
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Find and Rate Stores</h1>

            <div className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Search by store name..."
                        value={search.name}
                        onChange={e => setSearch({ ...search, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Search by address..."
                        value={search.address}
                        onChange={e => setSearch({ ...search, address: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map(store => (
                    <div key={store.id} className="bg-white rounded-lg shadow-lg p-6 hover:-translate-y-1 transition-transform">
                        <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
                        <p className="text-gray-600 mb-4">{store.address}</p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">Overall Rating:</span>
                                <StarRating rating={store.overallRating} readOnly />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">Your Rating:</span>
                                {store.userRating 
                                    ? <StarRating rating={store.userRating} readOnly />
                                    : <span className="text-sm text-gray-500">Not rated</span>}
                            </div>
                        </div>

                        <Button className="w-full mt-6" onClick={() => handleOpenRatingModal(store)}>
                            {store.userRating ? 'Update Your Rating' : 'Submit a Rating'}
                        </Button>
                    </div>
                ))}
            </div>

            <Modal isOpen={!!selectedStore} onClose={handleCloseRatingModal} title={`Rate ${selectedStore?.name}`}>
                <div className="flex flex-col items-center space-y-4">
                    <p>Select your rating:</p>
                    <StarRating rating={rating} setRating={setRating} size={36} />
                    <Button onClick={handleRatingSubmit} disabled={rating === 0}>
                        Submit Rating
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default UserDashboard;

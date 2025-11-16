import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import { DataTable } from '../components/table/DataTable';

const OwnerDashboard = () => {
    const { user } = useAuth();

    const [stores, setStores] = useState([]);

    const columns = [
        { accessor: 'userName', header: 'User Name', sortable: true },
        {
            accessor: 'ratingValue',
            header: 'Rating',
            sortable: true,
            render: (item) => <StarRating rating={Number(item.ratingValue)} readOnly />
        },
    ];

    // Fetch owner dashboard (multiple stores)
    const fetchOwnerData = useCallback(async () => {
        if (user && user.id) {
            const data = await apiService.getOwnerDashboard(user.id);
            setStores(data?.stores || []);
        }
    }, [user]);

    useEffect(() => {
        fetchOwnerData();
    }, [fetchOwnerData]);

    if (!user) return <p>Please login first.</p>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>

            {stores.length === 0 ? (
                <p>No stores assigned to you.</p>
            ) : (
                stores.map((s) => (
                    <div key={s.storeId} className="bg-white p-6 rounded-lg shadow space-y-4">

                        <h2 className="text-2xl font-semibold">{s.storeName}</h2>

                        <div className="flex items-center space-x-4">
                            <span>Average Rating:</span>
                            <StarRating rating={s.averageRating} readOnly />
                            <span>{s.averageRating.toFixed(2)} / 5.00</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-xl mb-2">Users Who Rated</h3>
                            <DataTable data={s.raters} columns={columns} />
                        </div>

                    </div>
                ))
            )}
        </div>
    );
};

export default OwnerDashboard;


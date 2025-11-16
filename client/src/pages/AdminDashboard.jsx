import React, { useState, useEffect, useMemo, useCallback } from "react";
import { apiService } from "../services/apiService";
import { DataTable } from "../components/table/DataTable";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import StarRating from "../components/common/StarRating";

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </dt>
            <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
              {value}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [view, setView] = useState("users");

  // MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("user");

  // NEW USER FORM
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "",
  });

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // NEW STORE FORM
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const handleNewStoreChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      alert("All fields are required");
      return;
    }

    try {
      await apiService.createUserAdmin(newUser);
      await fetchDashboardData();
      setIsModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "",
      });
    } catch (err) {
      alert(err?.data?.message || "Error creating user");
    }
  };

  const handleCreateStore = async () => {
    if (!newStore.name || !newStore.address || !newStore.owner_id) {
      alert("Name, Address & Owner ID are required");
      return;
    }

    try {
      await apiService.createStoreAdmin(newStore);
      await fetchDashboardData();
      setIsModalOpen(false);
      setNewStore({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });
    } catch (err) {
      alert(err?.data?.message || "Error creating store");
    }
  };

  // USER DETAILS
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = async (id) => {
    try {
      const details = await apiService.getUserDetails(id);
      setSelectedUser(details);
      setModalType("userDetails");
      setIsModalOpen(true);
    } catch {
      alert("Unable to load user details");
    }
  };

  // FETCH DASHBOARD DATA
  const fetchDashboardData = useCallback(async () => {
    setStats(await apiService.getAdminDashboardStats());
    setUsers(await apiService.getUsers());
    setStores(await apiService.getStoresForAdmin());
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // FILTERS
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        u.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        u.address.toLowerCase().includes(filters.address.toLowerCase()) &&
        (filters.role === "" || u.role === filters.role)
    );
  }, [users, filters]);

  const filteredStores = useMemo(() => {
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        s.address.toLowerCase().includes(filters.address.toLowerCase())
    );
  }, [stores, filters]);

  // COLUMNS
  // const userColumns = [
  //   {
  //     accessor: "name",
  //     header: "Name",
  //     sortable: true,
  //     render: (item) => (
  //       <span
  //         className="text-indigo-600 cursor-pointer"
  //         onClick={() => handleUserClick(item.id)}
  //       >
  //         {item.name}
  //       </span>
  //     ),
  //   },
  //   { accessor: "email", header: "Email", sortable: true },
  //   { accessor: "address", header: "Address", sortable: true },
  //   { accessor: "role", header: "Role", sortable: true },
  // ];
  const userColumns = [
  {
    header: "SNO",
    render: (item) => item.id,
  },
  {
    accessor: "name",
    header: "Name",
    sortable: true,
    render: (item) => (
      <span
        className="text-indigo-600 cursor-pointer"
        onClick={() => handleUserClick(item.id)}
      >
        {item.name}
      </span>
    ),
  },
  { accessor: "email", header: "Email", sortable: true },
  { accessor: "address", header: "Address", sortable: true },
  { accessor: "role", header: "Role", sortable: true },
];


  // const storeColumns = [
  //   { accessor: "name", header: "Store Name", sortable: true },
  //   { accessor: "email", header: "Email", sortable: true },
  //   { accessor: "address", header: "Address", sortable: true },
  //   {
  //     accessor: "rating",
  //     header: "Rating",
  //     sortable: true,
  //     render: (item) => <StarRating rating={item.rating} readOnly />,
  //   },
  // ];
  const storeColumns = [
  {
    header: "SNO",
    render: (item) => item.id,
  },
  { accessor: "name", header: "Store Name", sortable: true },
  { accessor: "email", header: "Email", sortable: true },
  { accessor: "address", header: "Address", sortable: true },
  {
    accessor: "rating",
    header: "Rating",
    sortable: true,
    render: (item) => <StarRating rating={item.rating} readOnly />,
  },
];


  // MODAL TITLE HANDLING
  const modalTitle =
    modalType === "user"
      ? "Add New User"
      : modalType === "store"
        ? "Add New Store"
        : "User Details";

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard title="Total Users" value={stats.users} />
        <StatCard title="Total Stores" value={stats.stores} />
        <StatCard title="Total Ratings" value={stats.ratings} />
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="sm:flex sm:items-center sm:justify-between mb-4">
          <div className="flex space-x-2">
            <Button
              variant={view === "users" ? "primary" : "secondary"}
              onClick={() => setView("users")}
            >
              Manage Users
            </Button>
            <Button
              variant={view === "stores" ? "primary" : "secondary"}
              onClick={() => setView("stores")}
            >
              Manage Stores
            </Button>
          </div>

          <Button
            onClick={() => {
              setModalType(view === "users" ? "user" : "store");
              setIsModalOpen(true);
            }}
          >
            Add New {view === "users" ? "User" : "Store"}
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            name="name"
            placeholder="Filter by Name"
            value={filters.name}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            name="email"
            placeholder="Filter by Email"
            value={filters.email}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            name="address"
            placeholder="Filter by Address"
            value={filters.address}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />

          {view === "users" && (
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="OWNER">Store Owner</option>
            </select>
          )}
        </div>

        {/* Table Rendering */}
        {view === "users" ? (
          <DataTable data={filteredUsers} columns={userColumns} />
        ) : (
          <DataTable data={filteredStores} columns={storeColumns} />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        {/* Add User */}
        {modalType === "user" && (
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={newUser.name}
              onChange={handleNewUserChange}
            />

            <Input
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
            />

            <Input
              label="Address"
              name="address"
              value={newUser.address}
              onChange={handleNewUserChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleNewUserChange}
            />

            <select
              name="role"
              value={newUser.role}
              onChange={handleNewUserChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="OWNER">Store Owner</option>
            </select>

            <Button onClick={handleCreateUser} className="w-full">
              Create User
            </Button>
          </div>
        )}

        {/* Add Store */}
        {modalType === "store" && (
          <div className="space-y-4">
            <Input
              label="Store Name"
              name="name"
              value={newStore.name}
              onChange={handleNewStoreChange}
            />

            <Input
              label="Email"
              name="email"
              value={newStore.email}
              onChange={handleNewStoreChange}
            />

            <Input
              label="Address"
              name="address"
              value={newStore.address}
              onChange={handleNewStoreChange}
            />

            <Input
              label="Owner ID"
              name="owner_id"
              value={newStore.owner_id}
              onChange={handleNewStoreChange}
            />

            <Button onClick={handleCreateStore} className="w-full">
              Create Store
            </Button>
          </div>
        )}

        {/* User Details */}
        {modalType === "userDetails" && selectedUser && (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Address:</strong> {selectedUser.address}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>

            {selectedUser.role === "OWNER" && (
              <p>
                <strong>Store Rating:</strong>{" "}
                {selectedUser.ownerRating?.toFixed(2)}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;

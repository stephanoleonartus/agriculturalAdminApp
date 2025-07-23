import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/Modal.css';

const ManageUsersModal = ({ closeModal }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/auth/farmers/', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Manage Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button className="edit-btn">Edit</button>
                                    <button className="delete-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="modal-actions">
                    <button type="button" className="btn-primary">Add User</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ManageUsersModal;

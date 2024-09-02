import React, { useEffect, useState } from 'react';
import { Box, Table, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DataTable = () => {
    const [data, setData] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:3001/api/signup')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setOpenConfirmDialog(true);
    };

    const handleDeleteConfirm = () => {
        const token = localStorage.getItem('token');

        axios.delete(`http://localhost:3001/api/signup/${itemToDelete._id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setSnackbarMessage('Deleted successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setOpenConfirmDialog(false);
                fetchData();
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    setSnackbarMessage('Session expired, please log in again');
                    setSnackbarSeverity('error');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setSnackbarMessage('Error deleting item');
                    setSnackbarSeverity('error');
                }
                setSnackbarOpen(true);
                console.error('There was an error deleting the item!', error);
            });
    };

    const handleEditClick = (item) => {
        setEditItem(item);
        setFirstName(item.firstName);
        setLastName(item.lastName);
        setEmail(item.email);
        setPassword(item.password);
        setOpenDialog(true);
    };

    const handleUpdate = () => {
        const token = localStorage.getItem('token');

        axios.put(`http://localhost:3001/api/signup/${editItem._id}`, {
            firstName,
            lastName,
            email,
            password
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setSnackbarMessage('Updated successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setOpenDialog(false);
                fetchData();
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    setSnackbarMessage('Session expired, please log in again');
                    setSnackbarSeverity('error');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setSnackbarMessage('Error updating item');
                    setSnackbarSeverity('error');
                }
                setSnackbarOpen(true);
                console.error('There was an error updating the item!', error);
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ p: 3, minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 1200 }}> {/* Increase maxWidth to 1200 */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/signup')}
                    sx={{ mb: 2, mr: 2 }}
                >
                    Add User
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                    sx={{ mb: 2 }}
                >
                    Login
                </Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>SNo</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Password</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.firstName}</TableCell>
                                    <TableCell>{item.lastName}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.password}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEditClick(item)} color="primary" sx={{ mr: 1 }}>
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDeleteClick(item)} color="secondary">
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="edit-dialog-title">
                    <DialogTitle id="edit-dialog-title">Edit Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
                        <Button onClick={handleUpdate} color="primary">Update</Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog */}
                <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} aria-labelledby="confirm-dialog-title">
                    <DialogTitle id="confirm-dialog-title">Confirm Deletion</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this user?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirmDialog(false)} color="primary">Cancel</Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">Delete</Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for success/error messages */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default DataTable;

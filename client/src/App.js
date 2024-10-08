import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import DataTable from './DataTable';
import Login from './Login';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DataTable />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              
            </Routes>
        </Router>
    );
};

export default App;

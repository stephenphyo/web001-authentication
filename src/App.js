import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* CSS Imports */
import './App.css';

/* Page Imports */
import Landing from 'pages/Landing';
import Login from 'pages/Login';
import Register from 'pages/Register';
import RegisterSuccess from 'pages/RegisterSuccess';
import ForgotPassword from 'pages/ForgotPassword';
import ForgotPasswordOTP from 'pages/ForgotPasswordOTP';
import ResetPassword from 'pages/ResetPassword';
import ResetPasswordSuccess from 'pages/ResetPasswordSuccess';
// Authorization Roles
import Layout01 from 'layouts/Layout01';
import Member from 'pages/Authorization Roles/Member';
import Staff from 'pages/Authorization Roles/Staff';
import Contributor from 'pages/Authorization Roles/Contributor';
import Admin from 'pages/Authorization Roles/Admin';

// Testing
import ShoppingCart from 'test/ShoppingCart';
import DrawCircleOnPhoto from 'test/DrawCircleOnPhoto';
import ImagePreview from 'test/ImagePreview';

import Home from 'pages/Home';

function App() {
    return (
        <Router>
            <main className='app'>
                <Routes>
                    <Route path='/' element={<Landing />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/register/success' element={<RegisterSuccess />} />
                    <Route path='/resetpassword' element={<ForgotPassword />} />
                    <Route path='/resetpassword/:id/otp' element={<ForgotPasswordOTP />} />
                    <Route path='/resetpassword/:id/submit' element={<ResetPassword />} />
                    <Route path='/resetpassword/:id/success' element={<ResetPasswordSuccess />} />
                    <Route path='/home' element={<Home />} />

                    {/* Authorization Roles */}
                    <Route element={<Layout01 />}>
                        <Route path='/authz/member' element={<Member />} />
                        <Route path='/authz/staff' element={<Staff />} />
                        <Route path='/authz/contributor' element={<Contributor />} />
                        <Route path='/authz/admin' element={<Admin />} />
                    </Route>

                    {/* Test */}
                    <Route element={<ShoppingCart />} path='/shoppingcart' />
                    <Route element={<ImagePreview />} path='/avatar/preview' />
                    <Route element={<DrawCircleOnPhoto />} path='/avatar/draw' />
                </Routes>
            </main>
        </Router>
    )
}

export default App;
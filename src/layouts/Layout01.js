import React from 'react';
import { Outlet } from 'react-router-dom';

/* Component Imports */
import Header from 'components/ui/Header';

function Layout01() {
    return (
        <main className='layout01'>
            <Header />
            <Outlet />
        </main>
    );
}

export default Layout01;
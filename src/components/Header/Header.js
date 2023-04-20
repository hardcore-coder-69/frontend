import React, { useEffect, useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import axios from 'axios';

import "./Header.css"

export default function Header() {
    const op = useRef(null);
    let navigate = useNavigate();
    const location = useLocation();
    const toast = useRef(null);
    const [userText, setUserText] = useState("Logout")
    const [userData, setUserData] = useState(null)

    function logoutHandler() {
        try {
            localStorage.removeItem('lms-token')
            navigate('/login')
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Successfully logged out of the system' });
            op.current.toggle()
        } catch (error) {
            console.log(error.message)
        }
    }

    function loginHandler() {
        try {
            navigate('/login')
            op.current.toggle()
        } catch (error) {
            console.log(error.message)
        }
    }

    function toggleOverlay(e) {
        if (location.pathname == '/login' || location.pathname == '/signup') {
            setUserText('Login')
        } else {
            setUserText('Logout')

            const config = {
                headers: {
                    "x-auth-token": localStorage.getItem('lms-token')
                }
            };

            axios
                .get('http://localhost:5000/auth', config)
                .then((response) => {
                    if (response.status === 200) {
                        const data = response.data
                        setUserData(data)
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                });
        }
        op.current.toggle(e)

    }

    return (
        <div className="header-container">
            <h1>Library Management System</h1>

            <div className="icon-container" onClick={(e) => toggleOverlay(e)}>
                <i className="pi pi-user"></i>
            </div>

            <OverlayPanel ref={op}>
                <div>
                    {userText === 'Logout' ? <h4 className='user-name'>{userData ? userData.first_name + ' ' + userData.last_name : 'Unknown User'}</h4> : ''}
                    {userText === 'Logout' ?
                        (
                            <div className='overlay-option' onClick={logoutHandler}>Logout</div>
                        ) :
                        <div className='overlay-option' onClick={loginHandler}>Login</div>
                    }
                </div>
            </OverlayPanel>
            <Toast ref={toast} />
        </div>
    );
}

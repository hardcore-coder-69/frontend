import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Style.css'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const toast = useRef(null);
    let navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('lms-token')) {
            navigate('/')
        }
    }, [])

    function handleLogin() {
        setIsLoggingIn(true);
        console.log(username, password);

        let data = {
            email: username,
            password: password,
            headers: {
                "content-type": "application/json"
            }
        };

        axios
            .post('http://localhost:5000/auth', data)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data
                    localStorage.setItem('lms-token', data.token)
                    navigate('/')
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
                }
                setIsLoggingIn(false)
            })
            .catch((err) => {
                const response = err.response
                if (response.status === 400) {
                    const errors = response.data.errors
                    console.log(errors)
                    if (errors && errors.length > 0) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                    }
                }
                setIsLoggingIn(false)
            });
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px' }}>
            <Card style={{ width: 'fit-content' }}>
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', paddingRight: '20px', textAlign: 'center' }}>
                    <h3>Enter login credentials</h3>

                    <div className="p-col-12 p-md-4">
                        <div className="p-inputgroup" style={{}}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Email"
                            />
                        </div>
                    </div>

                    <div className="p-col-12 p-md-4" style={{ marginTop: '35px' }}>
                        <div className="p-inputgroup" style={{}}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-key"></i>
                            </span>
                            <Password
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                toggleMask={true}
                                feedback={false}
                                placeholder="password"
                            />
                        </div>
                    </div>

                    <div className="p-col-12 p-md-4" style={{ marginTop: '50px' }}>
                        <Button
                            onClick={handleLogin}
                            style={{ width: '-webkit-fill-available' }}
                        >
                            {
                                isLoggingIn ?
                                    <i className="pi pi-spin pi-spinner" style={{ width: 'inherit', fontSize: '1.6rem' }}></i>
                                    :
                                    <div className="p-text-normal" style={{ width: 'inherit', fontSize: '1.2rem', fontWeight: 'bold' }}>Log In</div>
                            }
                        </Button>
                    </div>

                    <div className="p-col-12 p-md-4" style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                        <Link
                            to="/forgotten-password"
                            style={{ textDecoration: 'none', color: '#2196F3' }}
                        >Forgotten password?</Link>
                    </div>

                    <div className="p-col-12 p-md-4" style={{ marginTop: '50px' }}>
                        <Link
                            to="/signup"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                label="Create new account"
                                className="p-button-success"
                                style={{ fontWeight: 'bold' }}
                            />
                        </Link>
                    </div>

                </div>
            </Card>
            <Toast ref={toast} />
        </div>
    );
}
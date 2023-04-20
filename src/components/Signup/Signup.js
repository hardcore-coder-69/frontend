import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Signup() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const toast = useRef(null);
    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('lms-token')) {
            navigate('/')
        }
    }, [])

    function handleSignup() {

        setIsSigningUp(true);
        let signUpData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        }

        axios
            .post('http://localhost:5000/users/register', signUpData)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data
                    // localStorage.setItem('lms-token', data.token)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'User registered successfully' });
                    setTimeout(() => navigate('/login'), 3000)
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
                }
                setIsSigningUp(false)
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
                setIsSigningUp(false)
            });
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>

            <Card style={{ width: 'fit-content' }}>
                <h3 style={{ textAlign: 'center', margin: 0, marginBottom: '30px' }}>Register new user</h3>
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', paddingRight: '20px', textAlign: 'center' }}>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="p-col-12 p-md-4">
                            <div className="p-inputgroup" style={{}}>
                                <InputText
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    placeholder="Firstname"
                                />
                            </div>
                        </div>

                        <div className="p-col-12 p-md-4" style={{ marginLeft: '10px' }}>
                            <div className="p-inputgroup" style={{}}>
                                <InputText
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    placeholder="Surname"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-col-12 p-md-4" style={{ marginTop: '30px' }}>
                        <div className="p-inputgroup" style={{}}>
                            <InputText
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    <div className="p-col-12 p-md-4" style={{ marginTop: '30px' }}>
                        <div className="p-inputgroup" style={{}}>
                            <Password
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                // toggleMask={true}
                                feedback={false}
                                placeholder="Create new password"
                            />
                        </div>
                    </div>


                    <div className="p-col-12 p-md-4" style={{ marginTop: '20px' }}>

                        <div className="p-text-normal" style={{ fontSize: '0.7rem', marginBottom: '20px' }}>
                            By clicking Sign Up, you agree to our
                            <Link to="/about/terms" style={{ textDecoration: 'none', color: '#2196F3' }}> Terms</Link> and
                            <Link to="/about/privacy" style={{ textDecoration: 'none', color: '#2196F3' }}> Data policy</Link>.
                        </div>

                        <Button
                            onClick={handleSignup}
                            className="p-button-success"
                            style={{ width: '-webkit-fill-available' }}
                        >
                            {
                                isSigningUp ?
                                    <i class="pi pi-spin pi-spinner" style={{ width: 'inherit', fontSize: '1.6rem' }}></i>
                                    :
                                    <div className="p-text-normal" style={{ width: 'inherit', fontSize: '1.2rem', fontWeight: 'bold' }}>Sign Up</div>
                            }
                        </Button>
                    </div>

                    <div className="p-col-12 p-md-4" style={{ marginTop: '50px' }}>
                        <Link
                            to="/login"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                label="Back to Login page"
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
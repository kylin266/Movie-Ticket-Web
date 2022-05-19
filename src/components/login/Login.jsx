import React from 'react';
import './Login.css';
import logo from './906341.png'
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from "axios";
export default function Login() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const userChange = (event) => {
        setUsername(event.target.value);
    }
    const passwordChange = (event) => {
        setPassword(event.target.value);
    } 
    const login = async ()=>{
        const loginData = {
            "username": username,
            "password": password
        }
        await axios.post("http://localhost:3000/api/auth/signin",loginData).then(res => {
            console.log(res.data);

            if (res.data && res.data.accessToken) {
                    window.sessionStorage.setItem("token", res.data.accessToken );
                    window.sessionStorage.setItem("userId", res.data.id );
                    window.location.reload(false);
            }
            else alert("Wrong username or password")
        })
    }
    return (
        <div className="login-wrapper">
            <h1 className="logon">
                <img src={logo} /><a href="#">BHD Galaxy Cinema</a>
            </h1>
                <div className="formItem">
                    <h1 className="title">Username</h1>
                    <TextField
                        placeholder="Username"
                        id="username"
                        type="text"
                        className="textF"
                        value={username}
                        onChange={userChange}
                    />
                </div>
                <div className="formItem">
                    <h1 className="title">Password</h1>
                    <TextField
                        placeholder="Password"
                        id="password"
                        type="password"
                        className="textF"
                        value={password}
                        onChange={passwordChange}
                    />
                </div>
                <button onClick={login} className="btn-login">
                    Login
                </button>
        </div>
    )
}
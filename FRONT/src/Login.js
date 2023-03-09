import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import axios from 'axios';

import './main.css';

const Login = () => {
  const [login, setUsername] = useState('');
  const [senha, setPassword] = useState('');
  const navigate = useNavigate();

  const signIn = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login/', { login, senha });
      localStorage.setItem('token', response.data);
      if (response.data !== "") {
        navigate('/board');
      }
      else {
        alert("Login ou senha incorretos!")
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LoginBox>
      <TitleForm>Bem vindo ao Trello</TitleForm>
      <form onSubmit={signIn}>
        <LabelForm>Login:</LabelForm>
        <InputForm type="text" value={login} onChange={(event) => setUsername(event.target.value)} />

        <LabelForm>Senha:</LabelForm>
        <InputForm type="password" value={senha} onChange={(event) => setPassword(event.target.value)} />

        <LoginButton type='submit'> Login </LoginButton>
      </form>
    </LoginBox>   
  );
};

// Box de Login
const LoginBox = styled.div`
    display: flex;
    flex-direction: column;
    margin: 200px auto;
    width: 400px;
    padding: 32px 40px;
    background: rgb(255, 255, 255);
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px;
    box-sizing: border-box;
    color: rgb(94, 108, 132);
`;

// Titulo de Login
const TitleForm = styled.h1`
    color: #0C1424;
    font-size: 32px;
    text-align: center;
`;

// Label de Login
const LabelForm = styled.label`
    color: #484848;
    font-size: 18px;
    text-align: left;
    display: block;
    padding-bottom: 5px;
`;

// Input de Login
const InputForm = styled.input`
    color: #484848;
    font-size: 16px;
    border: 1px solid #c1c1c1;
    border-radius: 4px;
    width: 100%;
    height: 36px;
    margin-bottom: 15px;
`;

// Botão de Login
const LoginButton = styled.button`
    background-color: #2D4476;
    font-size: 18px;
    font-family: 'Tilt Warp', cursive;
    color: #f1f1f1;
    display: block;
    margin: auto;
    cursor: pointer;
    margin-top: 20px;
    padding: 8px 0px;
    width: 100%;
    border: none;
    border-radius: 5px;
`;

export default Login;
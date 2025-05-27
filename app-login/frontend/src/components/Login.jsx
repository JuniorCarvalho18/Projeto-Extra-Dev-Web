import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function Login({ updateAuthStatus }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('role');
		sessionStorage.removeItem('username');
		sessionStorage.removeItem('photo');
		sessionStorage.removeItem('fullName');

		const tokenExists = sessionStorage.getItem("token") !== null;
		if (tokenExists) {
			navigate("/home");
		}
	}, [navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axiosInstance.post("http://localhost:3001/login", {
				username,
				password,
			});

			if (response.data.accessToken) {
				sessionStorage.setItem("token", response.data.accessToken);
				sessionStorage.setItem("role", response.data.role);
				sessionStorage.setItem("username", username);
				sessionStorage.setItem("photo", response.data.photo);
				sessionStorage.setItem("fullName", response.data.fullName);
				updateAuthStatus(true); // Atualiza App.js
				navigate("/home"); // Vai para Home
			} else {
				alert("Login falhou");
			}
		} catch (error) {
			alert("Erro ao conectar ao servidor.");
		}
	};

	return (
		<div className="login-container">
			<h1 class="Titulo">Juninho's blog</h1>
			<p>Para postar fotos do Juninho Ruindade Pura</p>
			<img src="/Juninho.jfif" alt="Logo" className="logo" />
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Usuário"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Senha"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit">Entrar</button>
			</form>
		</div>
	);
}

export default Login;
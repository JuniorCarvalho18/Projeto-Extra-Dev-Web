import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

function Home() {
	const [users, setUsers] = useState([]);
	const token = sessionStorage.getItem("token");

	useEffect(() => {
		if (!token) {
			alert("Acesso negado. Faça login.");
			window.location.href = "/";
			return;
		}

		axiosInstance.get("http://localhost:3001/users", {
			headers: { Authorization: `Bearer ${token}` }
		})
		.then(response => {
			setUsers(response.data);
		})
		.catch(error => {
			console.error("Erro ao carregar usuários:", error);
			alert("Token inválido ou expirado.");
			window.location.href = "/";
		});
	}, [token]);

	return (
		<div className="home-container">
			<h1>Bem Vindo</h1>
			<ul>
				{users.map(user => (
					<li key={user.id}>{user.fullName} ({user.role})</li>
				))}
			</ul>
		</div>
	);
}

export default Home;
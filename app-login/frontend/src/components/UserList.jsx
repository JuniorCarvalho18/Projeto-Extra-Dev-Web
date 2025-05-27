import React, { useEffect, useState } from "react";
import axiosInstance from '../services/axiosInstance';
import { Link } from "react-router-dom";

function UserList() {
	const [users, setUsers] = useState([]);

	// Carrega a lista de usuários ao montar o componente
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const token = sessionStorage.getItem("token");
			const response = await axiosInstance.get("http://localhost:3001/users", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setUsers(response.data);
		} catch (error) {
			console.error("Erro ao carregar usuários:", error);
		}
	};

	const handleDelete = async (userId) => {
		try {
			const token = sessionStorage.getItem("token");
			await axiosInstance.delete(`http://localhost:3001/users/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			alert("Usuário deletado com sucesso!");
			fetchUsers();
		} catch (error) {
			console.error("Erro ao deletar usuário:", error);
			alert("Erro ao deletar usuário.");
		}
	};

	return (
		<div class="home-container">
			<h2>Lista de Usuários</h2>
			<button>
				<Link id="Nuser" to="/users/new">Novo Usuário</Link>
			</button>
			<ul>
				{users.map(user => (
					<li key={user.id}>
						{user.fullName} ({user.role})
						<Link to={`/users/edit/${user.id}`}>Editar</Link>
						<button onClick={() => handleDelete(user.id)}>Deletar</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default UserList;
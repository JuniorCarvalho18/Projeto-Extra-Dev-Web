import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ updateAuthStatus }) {
    const role = sessionStorage.getItem("role"); // Obtém a função do usuário

	const handleLogout = () => {
		sessionStorage.removeItem("token"); // Remove o token de autenticação
		sessionStorage.removeItem("role"); // Remove o tipo de usuário
		sessionStorage.removeItem('username');
		sessionStorage.removeItem('photo');
		sessionStorage.removeItem('fullName');
		window.location.href = "/";
	};

	return (
		<div className="sidebar">
			<ul>
				<li><Link to="/home">Dashboard</Link></li>
				{role === "admin" && ( // Mostra o link de "Usuários" apenas para admin
					<li><Link to="/users">Usuários</Link></li>
				)}
				<li><Link to="/files">Arquivos</Link></li>
			</ul>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default Sidebar;
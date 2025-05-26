import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import NotFound from "./components/NotFound";
import UserHeader from "./components/UserHeader";
import FileList from "./components/FileList";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(
		sessionStorage.getItem("token") !== null
	);

	const location = useLocation(); // Obtém a localização atual da rota

	// Função para atualizar o estado de autenticação
	const updateAuthStatus = (status) => {
		setIsAuthenticated(status);
	};

	useEffect(() => {
		const tokenExists = sessionStorage.getItem("token") !== null;
		if (!tokenExists && location.pathname !== "/login") {
			alert("Você precisa fazer login primeiro!");
		}
	}, [location]);

	// Função para verificar se o usuário é admin
	const isAdmin = () => {
		return sessionStorage.getItem("role") === "admin";
	};

	const user = {
		fullName: sessionStorage.getItem("fullName"),
		role: sessionStorage.getItem("role"),
		photo: sessionStorage.getItem("photo"),
	};

	return (
		<div className="app-container">
			{isAuthenticated && <Sidebar updateAuthStatus={updateAuthStatus} />} {/* Renderiza o Sidebar apenas se autenticado */}
			<div className="content">
				{isAuthenticated && <UserHeader user={user} />}
				<Routes>
					<Route
						path="/"
						element={
							isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
						}
					/>

					<Route
						path="/login"
						element={<Login updateAuthStatus={updateAuthStatus} />}
					/>

					<Route
						path="/home"
						element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
					/>
					<Route
						path="/users"
						element={
							isAuthenticated && isAdmin() ? <UserList /> : <Navigate to="/login" />
						}
					/>
					<Route
						path="/users/new"
						element={
							isAuthenticated && isAdmin() ? <UserForm /> : <Navigate to="/login" />
						}
					/>
					<Route
						path="/users/edit/:id"
						element={
							isAuthenticated && isAdmin() ? <UserForm /> : <Navigate to="/login" />
						}
					/>
					<Route
						path="/files"
						element={
							isAuthenticated ? <FileList /> : <Navigate to="/login" />
						}
					/>
					<Route 
						path="*" 
						element={
							<NotFound />} />
				</Routes>
			</div>
		</div>
	);
}

export default function AppWrapper() {
	return (
		<Router>
			<App />
		</Router>
	);
}
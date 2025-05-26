import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
	return (
		<div style={{ textAlign: "center", marginTop: "100px" }}>
			<h1>404 - Página Não Encontrada</h1>
			<p>A página que você procura não existe ou foi removida.</p>
			<Link to="/">Voltar para o Login</Link>
		</div>
	);
}

export default NotFound;

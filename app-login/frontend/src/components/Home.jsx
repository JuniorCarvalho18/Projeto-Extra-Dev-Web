import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { Link } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchPosts();
        fetchUsers();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axiosInstance.get("http://localhost:3001/posts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(response.data);
        } catch (error) {
            console.error("Erro ao carregar postagens:", error);
            alert("Erro ao carregar postagens.");
        }
    };

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

    const handleDelete = async (postId) => {
        try {
            const token = sessionStorage.getItem("token");
            await axiosInstance.delete(`http://localhost:3001/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Postagem deletada com sucesso!");
            fetchPosts(); // Atualiza a lista de postagens
        } catch (error) {
            console.error("Erro ao deletar postagem:", error);
            alert("Erro ao deletar postagem.");
        }
    };

    return (
        <div className="container">
            <h2>Home</h2>
                <Link className="NewS" to="/posts/new">Nova Postagem</Link>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <ul>
				{users.map(user => (
					<li key={user.id}>
						{user.fullName} ({user.role})
					</li>
				))}
			</ul>
                        {post.texto}
                        <Link to={`/posts/edit/${post.id}`}>Editar</Link>
                        <button onClick={() => handleDelete(post.id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
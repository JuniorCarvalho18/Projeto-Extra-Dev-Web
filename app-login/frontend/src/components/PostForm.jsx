import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

function PostForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ texto: "" });

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axiosInstance.get(`http://localhost:3001/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPost(response.data);
        } catch (error) {
            console.error("Erro ao carregar postagem:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem("token");
            if (id) {
                await axiosInstance.put(`http://localhost:3001/posts/${id}`, post, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert("Postagem atualizada com sucesso!");
            } else {
                await axiosInstance.post("http://localhost:3001/posts", post, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert("Postagem criada com sucesso!");
            }
            navigate("/posts");
        } catch (error) {
            console.error("Erro ao salvar postagem:", error);
            alert("Erro ao salvar postagem.");
        }
    };

    return (
        <div className="form-container">
            <h2>{id ? "Editar Postagem" : "Nova Postagem"}</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={post.texto}
                    onChange={(e) => setPost({ ...post, texto: e.target.value })}
                    placeholder="Digite o texto da postagem"
                    required
                />
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => navigate("/posts")}>Cancelar</button>
            </form>
        </div>
    );
}

export default PostForm;
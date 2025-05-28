import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function PostForm() {
  const [texto, setTexto] = useState(""); 
  const [photo, setPhoto] = useState(null); 
  const [existingPhoto, setExistingPhoto] = useState(null); 
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    if (id) {
      const token = sessionStorage.getItem("token");
      axiosInstance.get(`http://localhost:3001/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setTexto(res.data.texto);
          setExistingPhoto(res.data.photo);
        })
        .catch((err) => {
          console.error("Erro ao carregar postagem:", err);
          alert("Erro ao carregar os dados da postagem.");
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = { texto };
    const token = sessionStorage.getItem("token");

    try {
      let postResponse;
      if (id) {
        postResponse = await axiosInstance.put(`http://localhost:3001/posts/${id}`, postData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        postResponse = await axiosInstance.post("http://localhost:3001/posts", postData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Após criar ou atualizar, se tiver imagem, envia a foto:
      if (photo) {
        const formData = new FormData();
        formData.append("photo", photo);
        const postId = id || postResponse.data.id;

        await axiosInstance.post(`http://localhost:3001/posts/${postId}/photo`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/posts");
    } catch (error) {
      console.error("Erro ao salvar postagem:", error);
      alert("Erro ao salvar postagem.");
    }
  };

  return (
    <div className="container">
      <h2>{id ? "Editar Postagem" : "Nova Postagem"}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Digite o texto da postagem"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          required
        />
        {existingPhoto && (
          <img
            src={`http://localhost:3001/uploads/${existingPhoto}`}
            alt="Foto atual"
            className="post-photo"
          />
        )}
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default PostForm;
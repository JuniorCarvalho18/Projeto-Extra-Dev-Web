import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function UserForm() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("common");
  const [photo, setPhoto] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
  if (id) {
    const token = sessionStorage.getItem("token");
    axiosInstance.get(`http://localhost:3001/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setFullName(res.data.fullName);
      setUsername(res.data.username);
      setRole(res.data.role);
      setExistingPhoto(res.data.photo);
    })
    .catch((err) => {
      console.error("Erro ao carregar usuário:", err);
      alert("Erro ao carregar os dados do usuário.");
    });
  }
}, [id]);


const handleSubmit = async (e) => {
	e.preventDefault();

	if (password !== confirmPassword) {
		alert("As senhas não coincidem!");
		return;
	}

	const userData = { fullName, username, password, role };
	const token = sessionStorage.getItem("token");

	try {
		let userResponse;
		if (id) {
			userResponse = await axiosInstance.put(`http://localhost:3001/users/${id}`, userData, {
				headers: { Authorization: `Bearer ${token}` }
			});
		} else {
			userResponse = await axiosInstance.post("http://localhost:3001/users", userData, {
				headers: { Authorization: `Bearer ${token}` }
			});
		}

		// Após criar ou atualizar, se tiver imagem, envia a foto:
		if (photo) {
			const formData = new FormData();
			formData.append('photo', photo);
			const userId = id || userResponse.data.id;

		await axiosInstance.post(`http://localhost:3001/users/${userId}/photo`, formData, {
			headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'multipart/form-data'
			}
		});
		}

		navigate("/users");
	} catch (error) {
		console.error("Erro ao salvar usuário:", error);
	}
};

  return (
    <div>
      <h2>{id ? "Editar Usuário" : "Novo Usuário"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="common">Comum</option>
        </select>

        {existingPhoto && (
			<img 
				src={`http://localhost:3001/uploads/${existingPhoto}`} 
				alt="Foto atual" 
				className="user-photo" 
			/>
			)}

        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default UserForm;
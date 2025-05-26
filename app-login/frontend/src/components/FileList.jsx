import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';

function FileList() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axiosInstance.get('http://localhost:3001/files', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Erro ao buscar arquivos:", err);
      }
    };

    fetchFiles();
  }, [token]);  // token como dependência, caso mude futuramente

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosInstance.post('http://localhost:3001/files', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      // Após upload, atualiza lista
      const res = await axiosInstance.get('http://localhost:3001/files', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Erro ao fazer upload:", err);
    }
  };

  const handleDelete = async (name) => {
    try {
      await axiosInstance.delete(`http://localhost:3001/files/${name}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Após deletar, atualiza lista
      const res = await axiosInstance.get('http://localhost:3001/files', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Erro ao deletar arquivo:", err);
    }
  };

  return (
    <div>
      <h2>Arquivos PDF</h2>
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={e => setFile(e.target.files[0])} 
          required 
        />
        <button type="submit">Upload</button>
      </form>
      <ul>
        {files.map(f => (
          <li key={f}>
            <a href={`http://localhost:3001/uploads/${f}`} target="_blank" rel="noopener noreferrer">{f}</a>
            <button onClick={() => handleDelete(f)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;

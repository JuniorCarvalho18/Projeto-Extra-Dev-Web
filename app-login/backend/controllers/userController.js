const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');

// Listar todos os usuários
exports.listUsers = async (req, res) => {
	try {
		const users = await User.findAll();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: "Erro ao listar usuários." });
	}
};

// Criar um novo usuário
// exports.createUser = async (req, res) => {
// 	try {
// 		const { fullName, username, password, role } = req.body;
// 		const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha
// 		const user = await User.create({ fullName, username, password: hashedPassword, role });
// 		res.status(201).json(user);
// 	} catch (error) {
// 		res.status(500).json({ error: "Erro ao criar usuário." });
// 	}
// };

exports.createUser = async (req, res) => {
    try {
        let { fullName, username, password, role } = req.body;

        // Sanitiza entradas
        fullName = sanitizeHtml(fullName);
        username = sanitizeHtml(username);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            username,
            password: hashedPassword,
            role
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário." });
    }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { fullName, username, password, role } = req.body;
		const user = await User.findByPk(id);
		if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

		user.fullName = fullName;
		user.username = username;
		if (password) user.password = await bcrypt.hash(password, 10); // Atualiza senha se fornecida
		user.role = role;
		await user.save();

		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Erro ao atualizar usuário." });
	}
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByPk(id);
		if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

		await user.destroy();
		res.json({ message: "Usuário deletado com sucesso." });
	} catch (error) {
		res.status(500).json({ error: "Erro ao deletar usuário." });
	}
};

exports.getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByPk(id);
		if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

		res.json({
			id: user.id,
			fullName: user.fullName,
			username: user.username,
			role: user.role
		});
	} catch (err) {
		res.status(500).json({ error: "Erro ao buscar usuário" });
	}
};

// Upload da foto do usuário
exports.uploadUserPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    user.photo = req.file.filename;
    await user.save();

    res.json({ message: "Foto atualizada com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar foto:", err);
    res.status(500).json({ error: "Erro ao atualizar foto." });
  }
};

// Upload de arquivo PDF
exports.uploadPdfFile = (req, res) => {
  try {
    res.json({ filename: req.file.filename, message: "Arquivo PDF enviado com sucesso." });
  } catch (err) {
    console.error("Erro ao enviar PDF:", err);
    res.status(500).json({ error: "Erro ao enviar PDF." });
  }
};

// Listar arquivos PDF
exports.listPdfFiles = (req, res) => {
  try {
    const files = fs.readdirSync('./uploads/');
    const pdfs = files.filter(file => file.endsWith('.pdf'));
    res.json(pdfs);
  } catch (err) {
    console.error("Erro ao listar PDFs:", err);
    res.status(500).json({ error: "Erro ao listar PDFs." });
  }
};

// Deletar arquivo PDF
exports.deletePdfFile = (req, res) => {
  try {
    const filePath = path.join('./uploads/', req.params.name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Arquivo deletado com sucesso." });
    } else {
      res.status(404).json({ error: "Arquivo não encontrado." });
    }
  } catch (err) {
    console.error("Erro ao deletar PDF:", err);
    res.status(500).json({ error: "Erro ao deletar PDF." });
  }
};

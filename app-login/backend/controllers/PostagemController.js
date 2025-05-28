const Postagem = require("../models/Postagem");
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');

// Listar todas as postagens
exports.listPostagens = async (req, res) => {
  try {
    const postagens = await Postagem.findAll();
    res.json(postagens);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar postagens." });
  }
};

// Criar uma nova postagem
exports.createPostagem = async (req, res) => {
  try {
    console.log("Dados recebidos:", req.body); // Log para verificar os dados recebidos
    const { texto } = req.body;
    texto = sanitizeHtml(texto);

    if (!texto) {
      return res.status(400).json({ error: "O campo 'texto' é obrigatório." });
    }

    const postagem = await Postagem.create({ texto });
    res.status(201).json(postagem);
  } catch (error) {
    console.error("Erro ao criar postagem:", error); // Log para identificar o erro
    res.status(500).json({ error: "Erro ao criar postagem." });
  }
};

// Atualizar uma postagem
exports.updatePostagem = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    const postagem = await Postagem.findByPk(id);
    if (!postagem) return res.status(404).json({ error: "Postagem não encontrada." });

    postagem.texto = sanitizeHtml(texto);
    await postagem.save();

    res.json(postagem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar postagem." });
  }
};

// Deletar uma postagem
exports.deletePostagem = async (req, res) => {
  try {
    const { id } = req.params;
    const postagem = await Postagem.findByPk(id);
    if (!postagem) return res.status(404).json({ error: "Postagem não encontrada." });

    await postagem.destroy();
    res.json({ message: "Postagem deletada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar postagem." });
  }
};

// Buscar uma postagem por ID
exports.getPostagemById = async (req, res) => {
  try {
    const { id } = req.params;
    const postagem = await Postagem.findByPk(id);
    if (!postagem) return res.status(404).json({ error: "Postagem não encontrada." });

    res.json(postagem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar postagem." });
  }
};

// Upload de imagem para a postagem
exports.uploadPostagemPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const postagem = await Postagem.findByPk(id);
    if (!postagem) return res.status(404).json({ error: "Postagem não encontrada." });

    postagem.photo = req.file.filename;
    await postagem.save();

    res.json({ message: "Imagem da postagem atualizada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar imagem da postagem." });
  }
};

// Listar imagens de postagens
exports.listPostagemPhotos = (req, res) => {
  try {
    const photos = fs.readdirSync('./uploads/');
    const images = photos.filter(photo => photo.match(/\.(jpg|jpeg|png|gif)$/i));
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar imagens." });
  }
};

// Deletar imagem de postagem
exports.deletePostagemPhoto = (req, res) => {
  try {
    const photoPath = path.join('./uploads/', req.params.name);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
      res.json({ message: "Imagem deletada com sucesso." });
    } else {
      res.status(404).json({ error: "Imagem não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar imagem." });
  }
};

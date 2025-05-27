const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const Postagem = sequelize.define("Postagem", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	Texto: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	photo: {
		type: DataTypes.STRING,
		allowNull: true
	}
});

module.exports = Postagem;
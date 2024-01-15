// db.js
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ingresosLAB");

const schema = new mongoose.Schema({
  fechaIngreso: Date,
  ingresa: String,
  email: String,
  interno: Number,
  equipo: String,
  marca: String,
  nSerie: String,
  falla: String,
  linea: String,
  sector: String,
});

const Modelo = mongoose.model("ingresos", schema);

module.exports = Modelo;

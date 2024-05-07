// db.js

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ingresosLAB");

const workers = new mongoose.Schema({
  nombre: String,
  apellido: String,
  nacimiento: Date,
  legajo: Number,
  mail: String,
});

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
  trabajador: { type: String, default: "" },
  estado: { type: String, default: "No iniciado" },
  comentarios: [{ type: String, default: "" }],
});

const Modelo = mongoose.model("ingresos", schema);

const schemaInterno = new mongoose.Schema({
  LINEA: String,
  REF1: String,
  REF2: String,
  INTERNO: String,
});

const ModeloInternos = mongoose.model("internos", schemaInterno);

const schemaTea = new mongoose.Schema({
  LINEA: String,
  UNIDAD: String,
  MES: String,
  ESTADO: { type: String, default: "No realizado" },
  TRABAJADORES: [{ type: String, default: "" }],
  COMENTARIOS: [{ type: String, default: "" }],
});

const ModeloTea = mongoose.model("tea", schemaTea);

const schemaTelemandos = new mongoose.Schema({
  LINEA: String,
  SISTEMA: String,
  UNIDAD: String,
  MES: String,
  ESTADO: { type: String, default: "No realizado" },
  TRABAJADORES: { type: String, default: "" },
  COMENTARIOS: [{ type: String, default: "" }],
});

const ModeloTelemandos = mongoose.model("telemandos", schemaTelemandos);

module.exports = { Modelo, ModeloInternos, ModeloTea, ModeloTelemandos };

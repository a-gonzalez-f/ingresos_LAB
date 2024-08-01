// db.js

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://172.26.211.60:27017/ingresosLAB", {})
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

mongoose.connection.on("connected", () => {
  console.log("Conectado a MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Error de conexión a MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Desconectado de MongoDB");
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
  linea: String,
  unidad: String,
  mes: String,
  estado: String,
  trabajador: [{ type: String, default: "" }],
  comentarios: [{ type: String, default: "" }],
});

const ModeloTea = mongoose.model("teas", schemaTea);

const schemaTelemandos = new mongoose.Schema({
  linea: String,
  sistema: String,
  unidad: String,
  mes: String,
  estado: String,
  trabajador: [{ type: String, default: "" }],
  comentarios: [{ type: String, default: "" }],
});

const ModeloTelemandos = mongoose.model("telemandos", schemaTelemandos);

module.exports = { Modelo, ModeloInternos, ModeloTea, ModeloTelemandos };

// server.js

const express = require("express");
const path = require("path");
const app = express();
const Modelo = require("./db");

app.use(express.json());

// Configura express.static para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, "public")));

// Ruta para manejar solicitudes GET en la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ingreso.html"));
});

// Ruta para manejar solicitudes POST en "/guardar-dato"
app.post("/guardar-dato", async (req, res) => {
  try {
    const nuevoDato = new Modelo(req.body);
    await nuevoDato.save();
    res.status(201).send("Dato guardado correctamente");
  } catch (error) {
    res.status(500).send("Error al guardar el dato");
  }
});

// Ruta para manejar solicitudes en /listado
app.get("/listado", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "listado.html"));
});

// Ruta para manejar solicitudes GET en "/listar-equipos"
app.get("/listar-equipos", async (req, res) => {
  try {
    const equipos = await Modelo.find();
    res.json(equipos);
  } catch (error) {
    res.status(500).send("Error al obtener la lista de equipos");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

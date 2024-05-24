// server.js

const express = require("express");
const path = require("path");
const app = express();
const { Modelo, ModeloInternos, ModeloTea, ModeloTelemandos } = require("./db");

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

// Ruta para manejar solicitudes DELETE en "/eliminar-equipo/:id"
app.delete("/eliminar-equipo/:id", async (req, res) => {
  try {
    const equipoId = req.params.id;
    const resultado = await Modelo.findByIdAndDelete(equipoId);

    if (!resultado) {
      // Si no se encuentra el equipo con el ID dado
      res.status(404).send("Equipo no encontrado");
      return;
    }

    res.status(200).send("Equipo eliminado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el equipo");
  }
});

// Ruta para manejar solicitudes PATCH en "/cambiar-estado/:id"
app.patch("/cambiar-estado/:id", async (req, res) => {
  try {
    const equipoId = req.params.id;
    const nuevoEstado = req.body.estado;

    const resultado = await Modelo.findByIdAndUpdate(
      equipoId,
      { estado: nuevoEstado },
      { new: true }
    );

    if (!resultado) {
      res.status(404).send("Equipo no encontrado");
      return;
    }

    res.status(200).send("Estado del equipo actualizado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el estado del equipo");
  }
});

// Ruta para manejar solicitudes PATCH en "/asignar-trabajador/:id"
app.patch("/asignar-trabajador/:id", async (req, res) => {
  try {
    const equipoId = req.params.id;
    const trabajador = req.body.trabajador;

    const resultado = await Modelo.findByIdAndUpdate(
      equipoId,
      { trabajador: trabajador },
      { new: true }
    );

    if (!resultado) {
      res.status(404).send("Equipo no encontrado");
      return;
    }

    res.status(200).send("Trabajador asignado correctamente al equipo");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al asignar el trabajador al equipo");
  }
});

// Ruta para manejar solicitudes GET en "/obtener-equipo/:id"
app.get("/obtener-equipo/:id", async (req, res) => {
  try {
    const equipoId = req.params.id;
    const equipo = await Modelo.findById(equipoId);

    if (!equipo) {
      res.status(404).send("Equipo no encontrado");
      return;
    }

    res.json(equipo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los detalles del equipo");
  }
});

// Ruta para manejar solicitudes POST en "/enviar-comentario/:id"
app.post("/enviar-comentario/:id", async (req, res) => {
  try {
    const equipoId = req.params.id;
    const comentario = req.body.comentario;

    // Buscar el equipo en la base de datos
    const equipo = await Modelo.findById(equipoId);

    if (!equipo) {
      // Si no se encuentra el equipo, enviar una respuesta de error
      res.status(404).send("Equipo no encontrado");
      return;
    }

    // Agregar el comentario al arreglo de comentarios del equipo
    equipo.comentarios.push(comentario);

    // Guardar el equipo actualizado en la base de datos
    await equipo.save();

    // Enviar una respuesta de éxito al cliente
    res.status(200).send("Comentario enviado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al enviar el comentario");
  }
});

// Ruta para manejar solicitudes DELETE en "/eliminar-comentario/:equipoId/:index"
app.delete("/eliminar-comentario/:equipoId/:index", async (req, res) => {
  try {
    const equipoId = req.params.equipoId;
    const index = parseInt(req.params.index);

    // Buscar el equipo en la base de datos
    const equipo = await Modelo.findById(equipoId);

    if (!equipo) {
      // Si no se encuentra el equipo, enviar una respuesta de error
      res.status(404).send("Equipo no encontrado");
      return;
    }

    // Verificar si el índice está dentro del rango de comentarios del equipo
    if (index < 0 || index >= equipo.comentarios.length) {
      res.status(400).send("Índice de comentario fuera de rango");
      return;
    }

    // Eliminar el comentario del arreglo de comentarios del equipo
    equipo.comentarios.splice(index, 1);

    // Guardar el equipo actualizado en la base de datos
    await equipo.save();

    // Enviar una respuesta de éxito al cliente
    res.status(200).send("Comentario eliminado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el comentario");
  }
});

// Ruta para mostrar internos.html
app.get("/internos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "internos.html"));
});

// Ruta para manejar solicitudes GET en "/listar-internos"
app.get("/listar-internos", async (req, res) => {
  try {
    const internos = await ModeloInternos.find();
    res.json(internos);
  } catch (error) {
    res.status(500).send("Error al obtener la lista de internos");
  }
});

// Ruta para mostrar preventivos
app.get("/preventivos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "preventivos.html"));
});

// Ruta para manejar solicitudes GET en "/mostrar-tea"
app.get("/mostrar-tea", async (req, res) => {
  try {
    const tea = await ModeloTea.find();
    res.json(tea);
  } catch (error) {
    res.status(500).send("Error al obtener la lista de internos");
  }
});

// Ruta para manejar solicitudes GET en "/mostrar-telemandos"
app.get("/mostrar-telemandos", async (req, res) => {
  try {
    const telemandos = await ModeloTelemandos.find();
    res.json(telemandos);
  } catch (error) {
    res.status(500).send("Error al obtener la lista de internos");
  }
});

// Ruta para manejar solicitudes PATCH en "/asignar-trabajador-tea/:teaId"
app.patch("/asignar-trabajador-tea/:teaId", async (req, res) => {
  try {
    const { teaId } = req.params;
    const { trabajador } = req.body;

    console.log(
      `Actualizando Tea con ID ${teaId} para asignar el trabajador ${trabajador}`
    );

    const resultado = await ModeloTea.findByIdAndUpdate(
      teaId,
      { trabajador: trabajador },
      { new: true }
    );

    if (!resultado) {
      return res.status(404).send("Tea no encontrado");
    }
    res.status(200).send("Trabajador asignado correctamente al Tea");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al asignar el trabajador al Tea");
  }
});

// Ruta para manejar solicitudes PATCH en "/asignar-trabajador-telemando/:telemandoId"
app.patch("/asignar-trabajador-telemando/:telemandoId", async (req, res) => {
  try {
    const { telemandoId } = req.params;
    const { trabajador } = req.body;

    console.log(
      `Actualizando Telemando con ID ${telemandoId} para asignar el trabajador ${trabajador}`
    );

    const resultado = await ModeloTelemandos.findByIdAndUpdate(
      telemandoId,
      { trabajador: trabajador },
      { new: true }
    );

    if (!resultado) {
      return res.status(404).send("Telemando no encontrado");
    }
    res.status(200).send("Trabajador asignado correctamente al Telemando");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al asignar el trabajador al Telemando");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

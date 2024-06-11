// server.js

const express = require("express");
const path = require("path");
const app = express();
const { Modelo, ModeloInternos, ModeloTea, ModeloTelemandos } = require("./db");

// Borrar trabajadores asignados en TEA
// ModeloTea.updateMany(
//   { trabajador: { $type: "string" } },
//   { $set: { trabajador: [""] } }
// )
//   .then((result) => {
//     console.log(`Se actualizaron ${result.nModified} documentos`);
//   })
//   .catch((error) => {
//     console.error("Error al actualizar documentos:", error);
//   });

// Borrar trabajadores asignados en Telemandos
// ModeloTelemandos.updateMany(
//   { trabajador: { $type: "string" } },
//   { $set: { trabajador: [""] } }
// )
//   .then((result) => {
//     console.log(`Se actualizaron ${result.nModified} documentos`);
//   })
//   .catch((error) => {
//     console.error("Error al actualizar documentos:", error);
//   });

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

    // Encuentra el documento y actualiza
    const tea = await ModeloTea.findById(teaId);

    if (!tea) {
      return res.status(404).send("Tea no encontrado");
    }

    // Verificar si el trabajador ya está en el array
    const index = tea.trabajador.indexOf(trabajador);
    if (index !== -1) {
      // Si el trabajador ya está presente, eliminarlo del array
      tea.trabajador.splice(index, 1);
    } else {
      // Si el trabajador no está presente, agregarlo al array
      tea.trabajador.push(trabajador);
    }

    // Actualizar el estado
    tea.estado = tea.trabajador.length > 1 ? "Realizado" : "No realizado";

    // Guardar el documento actualizado
    await tea.save();

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

    // Encuentra el documento y actualiza
    const telemando = await ModeloTelemandos.findById(telemandoId);
    if (!telemando) {
      return res.status(404).send("Telemando no encontrado");
    }

    // Verificar si el trabajador ya está en el array
    const index = telemando.trabajador.indexOf(trabajador);
    if (index !== -1) {
      // Si el trabajador ya está presente, eliminarlo del array
      telemando.trabajador.splice(index, 1);
    } else {
      // Si el trabajador no está presente, agregarlo al array
      telemando.trabajador.push(trabajador);
    }

    // Actualizar el estado
    telemando.estado =
      telemando.trabajador.length > 1 ? "Realizado" : "No realizado";

    // Guardar el documento actualizado
    await telemando.save();

    res.status(200).send("Trabajador asignado correctamente al Telemando");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al asignar el trabajador al Telemando");
  }
});

app.get("/obtener-preventivo/:itemType/:id", async (req, res) => {
  try {
    const { id, itemType } = req.params;
    let card;

    if (itemType === "tea") {
      card = await ModeloTea.findById(id);
    } else if (itemType === "telemando") {
      card = await ModeloTelemandos.findById(id);
    } else {
      res.status(400).send("Tipo de elemento no válido");
      return;
    }

    if (!card) {
      res.status(404).send("Card no encontrado");
      return;
    }

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los detalles del card");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/workers.json", (req, res) => {
  res.sendFile(path.join(__dirname, "workers.json"));
});

app.get("/supervisores.json", (req, res) => {
  res.sendFile(path.join(__dirname, "supervisores.json"));
});

// Ruta para manejar solicitudes POST en "/enviar-comentario/:itemType/:id"
// server.js

// Borrar trabajadores asignados en TEA
// ModeloTea.updateMany(
//   { trabajador: { $type: "string" } },
//   { $set: { trabajador: [""] } }
// )
//   .then((result) => {
//     console.log(`Se actualizaron ${result.nModified} documentos`);
//   })
//   .catch((error) => {
//     console.error("Error al actualizar documentos:", error);
//   });

// Borrar trabajadores asignados en Telemandos
// ModeloTelemandos.updateMany(
//   { trabajador: { $type: "string" } },
//   { $set: { trabajador: [""] } }
// )
//   .then((result) => {
//     console.log(`Se actualizaron ${result.nModified} documentos`);
//   })
//   .catch((error) => {
//     console.error("Error al actualizar documentos:", error);
//   });

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

    // Encuentra el documento y actualiza
    const tea = await ModeloTea.findById(teaId);

    if (!tea) {
      return res.status(404).send("Tea no encontrado");
    }

    // Verificar si el trabajador ya está en el array
    const index = tea.trabajador.indexOf(trabajador);
    if (index !== -1) {
      // Si el trabajador ya está presente, eliminarlo del array
      tea.trabajador.splice(index, 1);
    } else {
      // Si el trabajador no está presente, agregarlo al array
      tea.trabajador.push(trabajador);
    }

    // Actualizar el estado
    tea.estado = tea.trabajador.length > 1 ? "Realizado" : "No realizado";

    // Guardar el documento actualizado
    await tea.save();

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

    // Encuentra el documento y actualiza
    const telemando = await ModeloTelemandos.findById(telemandoId);
    if (!telemando) {
      return res.status(404).send("Telemando no encontrado");
    }

    // Verificar si el trabajador ya está en el array
    const index = telemando.trabajador.indexOf(trabajador);
    if (index !== -1) {
      // Si el trabajador ya está presente, eliminarlo del array
      telemando.trabajador.splice(index, 1);
    } else {
      // Si el trabajador no está presente, agregarlo al array
      telemando.trabajador.push(trabajador);
    }

    // Actualizar el estado
    telemando.estado =
      telemando.trabajador.length > 1 ? "Realizado" : "No realizado";

    // Guardar el documento actualizado
    await telemando.save();

    res.status(200).send("Trabajador asignado correctamente al Telemando");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al asignar el trabajador al Telemando");
  }
});

app.get("/obtener-preventivo/:itemType/:id", async (req, res) => {
  try {
    const { id, itemType } = req.params;
    let card;

    if (itemType === "tea") {
      card = await ModeloTea.findById(id);
    } else if (itemType === "telemando") {
      card = await ModeloTelemandos.findById(id);
    } else {
      res.status(400).send("Tipo de elemento no válido");
      return;
    }

    if (!card) {
      res.status(404).send("Card no encontrado");
      return;
    }

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los detalles del card");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/workers.json", (req, res) => {
  res.sendFile(path.join(__dirname, "workers.json"));
});

app.get("/supervisores.json", (req, res) => {
  res.sendFile(path.join(__dirname, "supervisores.json"));
});

// Ruta para manejar solicitudes POST en "/enviar-comentario/:itemType/:id"
app.post("/enviar-comentario/:itemType/:id", async (req, res) => {
  try {
    const { itemType, id } = req.params;
    const comentario = req.body.comentario;

    let modelo;
    if (itemType === "tea") {
      modelo = ModeloTea;
    } else if (itemType === "telemando") {
      modelo = ModeloTelemandos;
    } else {
      return res.status(400).send("Tipo de item no válido");
    }

    // Buscar el item en la base de datos
    const item = await modelo.findById(id);

    if (!item) {
      // Si no se encuentra el item, enviar una respuesta de error
      return res.status(404).send("Item no encontrado");
    }

    // Agregar el comentario al arreglo de comentarios del item
    item.comentarios.push(comentario);

    // Guardar el item actualizado en la base de datos
    await item.save();

    // Enviar una respuesta exitosa
    res.status(200).send("Comentario agregado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar el comentario");
  }
});

// Ruta para manejar solicitudes DELETE en "/eliminar-comentario/:itemType/:id/:index"
app.delete("/eliminar-comentario/:itemType/:id/:index", async (req, res) => {
  try {
    const { itemType, id, index } = req.params;

    let modelo;
    if (itemType === "tea") {
      modelo = ModeloTea;
    } else if (itemType === "telemando") {
      modelo = ModeloTelemandos;
    } else {
      return res.status(400).send("Tipo de item no válido");
    }

    // Buscar el item en la base de datos
    const item = await modelo.findById(id);

    if (!item) {
      // Si no se encuentra el item, enviar una respuesta de error
      return res.status(404).send("Item no encontrado");
    }

    // Eliminar el comentario del arreglo de comentarios del item
    if (index >= 0 && index < item.comentarios.length) {
      item.comentarios.splice(index, 1);
    } else {
      return res.status(400).send("Índice de comentario no válido");
    }

    // Guardar el item actualizado en la base de datos
    await item.save();

    // Enviar una respuesta exitosa
    res.status(200).send("Comentario eliminado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el comentario");
  }
});

// Ruta para manejar solicitudes DELETE en "/eliminar-comentario/:itemType/:id/:index"
app.delete("/eliminar-comentario/:itemType/:id/:index", async (req, res) => {
  try {
    const { itemType, id, index } = req.params;

    let modelo;
    if (itemType === "tea") {
      modelo = ModeloTea;
    } else if (itemType === "telemando") {
      modelo = ModeloTelemandos;
    } else {
      return res.status(400).send("Tipo de item no válido");
    }

    // Buscar el item en la base de datos
    const item = await modelo.findById(id);

    if (!item) {
      // Si no se encuentra el item, enviar una respuesta de error
      return res.status(404).send("Item no encontrado");
    }

    // Eliminar el comentario del arreglo de comentarios del item
    if (index >= 0 && index < item.comentarios.length) {
      item.comentarios.splice(index, 1);
    } else {
      return res.status(400).send("Índice de comentario no válido");
    }

    // Guardar el item actualizado en la base de datos
    await item.save();

    // Enviar una respuesta exitosa
    res.status(200).send("Comentario eliminado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el comentario");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

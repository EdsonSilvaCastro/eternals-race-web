var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new mongoose.Schema(
    {
      idEncoded: {
        type: String,
      },
      nombre: {
        type: String
      },
      apellidos: {
        type: String
      },
      fechaNacimiento: {
        type: String
      },
      categoria: {
        type: String
      },
      identificacion: {
        type: Boolean,
      },
      kit: {
        type: Boolean,
      },
      responsable: {
        type: String,
      },
      numeroCompetidor:{
        type: String,
      }
    },
    {
      collection: "usuariosValidados",
    }
  );

  module.exports = mongoose.model("Model", User);
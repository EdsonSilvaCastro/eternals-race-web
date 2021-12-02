var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var port = 3000;

var app = express();

var User = new mongoose.Schema(
  {
    nombres: {
      type: String,
    },
    apellidos: {
      type: String,
    },
    correo: {
      type: String,
    },
    edad: {
      type: String,
    },
    fechaNacimiento: {
      type: Date,
    },
    genero: {
      type: String,
    },
    pais: {
      type: String,
    },
    telefono: {
      type: String,
    },
    contactoEmerg: {
      type: String,
    },
    nombreEquipo: {
      type: String,
    },
    tipoSangre: {
      type: String,
    },
    talla: {
      type: String,
    },
    marcaBici: {
      type: String,
    },
    modelo: {
      type: String,
    },
    ano: {
      type: String,
    },
    rodada: {
      type: String,
    },
    alergias: {
      type: String,
    },
    tickets: {
      type: String,
    },
    terms: {
      type: String,
    },
    privacy: {
      type: String,
    }
  },
  {
    collection: "users",
  }
);

mongoose.Promise = global.Promise;
var Model = mongoose.model("Model", User);

mongoose.connect("mongodb://sharkathon.one:27015/participantes",{
  auth: {
      username:'mongo',
      password:'Jafra2018!'
  },
  authSource:"admin",
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(
  () => {
    console.log("Database connected ");
  },
  (error) => {
    console.log("Database not connected : " + error);
  }
);


// SDK de Mercado Pago
const mercadopago = require("mercadopago");

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-6478429900085566-113022-63306cae1bda1b35da01505c058e6c25-153057812",
});

app.listen(port, () => {
  console.log("PORT connected: " + port);
});

app.post("/checkout", (req, res) => {
  
  var myData = new Model(req.body);
  myData
    .save()
    .then((item) => {
      console.log("item saved to database")
    })
    .catch((err) => {
     console.log("unable to save to database");
    });

//Creamos el item para que mercado libre pueda crear el
  let preference = {
    items: [
      {
        title: 'Inscripcion Carrera',
        unit_price: parseInt(req.body.tickets),
        quantity: 1,
      },
    ],
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.redirect(response.body.init_point);
    })
    .catch(function (error) {
      console.log(error);
    });
});

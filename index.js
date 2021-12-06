var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var port = 8080;


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
      type: String,
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
    },
    responsal:
    {
      type:String,
    },
    paymentSatuts:
    {
      type: String,
    },
    validator: {
      type: Boolean,
    },
    idCompra:{
      type: String
    }
  },
  {
    collection: "users",
  }
);

mongoose.Promise = global.Promise;
var Model = mongoose.model("Model", User);

mongoose.connect("mongodb://sharkathon.one:27015/cuponPruebas",{
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
const { response } = require("express");

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Agrega credenciales
mercadopago.configure({
  access_token:
    //"APP_USR-6478429900085566-113022-63306cae1bda1b35da01505c058e6c25-153057812",
    "TEST-6478429900085566-113022-088e337cb14fed28c6c30a47f9a16330-153057812"
});

app.listen(port, () => {
  console.log("PORT connected: " + port);
});

//End point para redireccionar
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
    }
  ],
  back_urls: {
    "success": "http://localhost:8080/mensaje.html",
    "failure": "http://localhost:8080/feedback",
    "pending": "http://localhost:8080/feedback"
  },
  auto_return: "approved"
};

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
    // console.log(response.body);

      res.redirect(response.body.init_point);
    })
    .catch(function (error) {
      console.log(error);
    });
});



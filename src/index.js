var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var port = 8080;
const path = require("path");

var app = express();

//Cupones

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
    categoryAvalanche: {
      type: String,
    },
    categoryTrail: {
      type: String,
    },
    terms: {
      type: String,
    },
    privacy: {
      type: String,
    },
    responsal: {
      type: String,
    },
    paymentSatuts: {
      type: String,
    },
    validator: {
      type: Boolean,
    },
    idCompra: {
      type: String,
    },
    cupon: {
      type: String,
    },
    externalReference: {
      type: String,
    },
  },
  {
    collection: "users",
  }
);

mongoose.Promise = global.Promise;
var Model = mongoose.model("Model", User);

mongoose
  .connect("mongodb://sharkathon.one:27015/participantes", {
    auth: {
      username: "mongo",
      password: "Jafra2018!",
    },
    authSource: "admin",
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(
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
      console.log("item saved to database");
    })
    .catch((err) => {
      console.log("unable to save to database");
    });
  console.log(req.body);
  var concepto;
  //Caso de que no ingrese cupon solo cambiamos el concepto

  const trailRunningPrice = 400;
  const avalanchePrice = 600;

  //console.log(req.body);
  console.log(req.body);

  if (req.body.cupon == "") {
    if (req.body.tickets == "464") {
      concepto = "Trail Running" + " " + req.body.categoryTrail;
    } else {
      concepto = req.body.categoryAvalanche;
    }
  } else if (req.body.cupon == "100") {
    res.redirect("http://sharkathon.one/eternalsrace/mensaje.html");
  } else {
    if (req.body.tickets == "464") {
      req.body.tickets =
        trailRunningPrice -
        (trailRunningPrice * parseInt(req.body.cupon)) / 100 +
        64;
      concepto =
        "Trail Running" +
        " " +
        req.body.categoryTrail +
        " " +
        req.body.cupon +
        "%";
      console.log(req.body.tickets);
    } else {
      req.body.tickets =
        avalanchePrice -
        (avalanchePrice * parseInt(req.body.cupon)) / 100 +
        96;
      concepto = req.body.categoryAvalanche + " " + req.body.cupon + "%";
      console.log(req.body.tickets);
    }
  }

  //res.redirect("http://eternalsracemexico.com/cierreInscripciones.html");

  //Creamos el item para que mercado libre pueda crear el

 let preference = {
    items: [
      {
        title: concepto,
        unit_price: parseInt(req.body.tickets),
        quantity: 1,
      },
    ],
    "payer": {
      "name": req.body.nombres,
      "surname": req.body.apellidos,
      "email": req.body.correo,
      "phone": {
        "area_code": "52",
        "number": parseInt(req.body.telefono),
      },
    },
    back_urls: {
      success: "https://ready2solve.club:8089/mensaje.html",
      failure: "https://ready2solve.club:8089/",
      pending: "https://ready2solve.club:8089/",
    },
    auto_return: "approved",

    payment_methods: {
      excluded_payment_methods: [{ id: "paypal" }],
      excluded_payment_types:[{id: "ticket"}]
    },
    "external_reference": req.body.externalReference
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

var mongoose = require("mongoose");
var Schema = mongoose.Schema;



var cupon = new mongoose.Schema(
    {
    code: {
        type: String,
      },
      used: {
        type: Boolean,
      },
      percentage: {
        type: Number
      },
      restriction: {
        type: String
      },
      unique: {
        type: Boolean
      }
    },
    {
      collection: "cupones",
    }
  );
  

  module.exports = mongoose.model("Cupon", cupon);
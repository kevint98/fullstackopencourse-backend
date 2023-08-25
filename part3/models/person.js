const mongoose = require("mongoose");

const validator = (value) => {
  return /\d{2,3}-\d{5,}/.test(value);
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: validator,
      message:
        "Number must have length of at least 8, formatted as XX(X)-XXXXX ",
    },
  },
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);

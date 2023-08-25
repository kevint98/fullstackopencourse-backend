const personsInfoRouter = require("express").Router();
const Person = require("../models/person");

personsInfoRouter.get("/", (request, response) => {
  const requestDate = new Date(Date.now());

  Person.countDocuments({}).then((number) => {
    response.send(`<p>Phonebook has info for ${number} people</p>
    <p>${requestDate.toString()}</p>`);
  });
});

module.exports = personsInfoRouter;

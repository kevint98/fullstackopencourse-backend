const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

personsRouter.get("/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

personsRouter.post("/", (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

personsRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).send({
          error: `Information for ${person.name} has already been removed from server`,
        });
      }
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;

const express = require('express');
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const getInfo = () => {
  const requestDate = new Date(Date.now());
  return `<p>Phonebook has info for ${persons.length} people</p>
     <p>${requestDate.toString()}</p>`;
};

const generateId = () => {
  const max = 100;
  const nextId = Math.floor(Math.random() * max);

  const idExists = persons.some((person) => person.id === nextId);

  if (idExists) {
    generateId();
  } else {
    return nextId;
  }
};

app.get('/info', (request, response) => {
  response.send(getInfo());
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    return response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  const nameExists = persons.some((p) => p.name === person.name);

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  } else if (!person.name || !person.number) {
    return response.status(404).json({
      error: 'must include name and number',
    });
  }

  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server now running on port ${PORT}`);

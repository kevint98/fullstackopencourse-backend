require("dotenv").config();
const mongoose = require("mongoose");

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://${process.env.DB_USERNAME}:${password}@${process.env.DB_HOST}/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 3) {
  console.log("provide db password as argument");
  process.exit(1);
} else if (process.argv.length === 5) {
  const newName = process.argv[3];
  const newNumber = process.argv[4];

  const person = new Person({
    name: newName,
    number: newNumber,
  });

  person.save().then((result) => {
    console.log(`added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

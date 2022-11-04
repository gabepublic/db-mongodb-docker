const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled

  // everything is derived from SCHEMA
  const kittySchema = new mongoose.Schema({
    name: String
  });
  
  // METHODS can be added to the schema
  kittySchema.methods.speak = function speak() {
    const greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  };
  
  // compile the schema into MODEL
  // NOTE: if the schema changes after compilation, it needs to be
  // re-compiled
  const Kitten = mongoose.model('Kitten', kittySchema);
  
  // Retrieve from MongoDB and access all of the kitten documents
  const kittens = await Kitten.find();
  console.log(kittens);
  
  let fluffy = await Kitten.find({ name: /^fluff/ });
  console.log(fluffy[0]);
  fluffy[0].speak();
  //fluffy.speak();
}
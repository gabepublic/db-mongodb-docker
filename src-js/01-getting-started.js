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
  
  // a Model is a CLASS; the Class is constructed into DOCUMENT
  const silence = new Kitten({ name: 'Silence' });
  console.log(silence.name); // 'Silence'
  
  const fluffy = new Kitten({ name: 'fluffy' });
  fluffy.speak(); // "Meow name is fluffy"
 
  // So far nothing has been saved to MongoDB
  // Document can be saved to the database by calling its save method.
  // The first argument to the callback will be an error if any occurred.
  let saved_fluffy = await fluffy.save();
  console.log(saved_fluffy);
  fluffy.speak(); // "Meow name is fluffy"

}
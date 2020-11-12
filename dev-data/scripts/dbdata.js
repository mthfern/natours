const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const Tour = require('../../models/tourModel');

const params = process.argv.slice(2);

const dbconnection = process.env.DBCONNECTION.replace(
  '<PASSWORD>',
  process.env.DBPWD
);

mongoose
  .connect(dbconnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`database connected...`);
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`, 'utf-8')
);

const cleanDb = async () => {
  try {
    await Tour.deleteMany();
    console.log('tours cleaned!');
  } catch (err) {
    console.log(`failed to clean tours: ${err.message}`);
  }

  process.exit();
};

const loadDb = async () => {
  try {
    await Tour.create(tours);
    console.log('tours imported!');
  } catch (err) {
    console.log(`failed to import tours: ${err.message}`);
  }

  process.exit();
};

if (params[0] === '--clean-tours') {
  cleanDb();
} else if (params[0] === '--import-tours') {
  loadDb();
} else {
  console.log('invalid parameters!');
  process.exit();
}

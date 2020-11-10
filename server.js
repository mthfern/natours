require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

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
    console.log(`database connected`);
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name!'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, 'A tour must have a price!'] },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'Sea deeps',
  price: 397,
  rating: 4.8,
})
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log(err.message));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

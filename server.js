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

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

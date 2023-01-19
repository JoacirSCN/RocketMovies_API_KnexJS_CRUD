require('express-async-errors');
const AppError = require('./utils/AppError');

const express = require('express');
const router = require('./routes');
const { response } = require('express');

const app = express();
app.use(express.json());

app.use(router);

app.use((error, req, res, next) => {
  if(error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.log(error);

  return res.status(500).json({
    status: "error",
    message: "Interval server error",
  });
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}.`));
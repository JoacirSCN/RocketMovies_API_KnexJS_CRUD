const express = require('express');
const router = require('./routes');

const app = express();
app.use(express.json());

app.use(router);

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}.`));
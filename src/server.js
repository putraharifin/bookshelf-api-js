const express = require('express');
const routes = require('./routes');

const init = () => {
  const app = express();
  const PORT = 9000;

  // Middleware untuk membaca JSON body request
  app.use(express.json());

  // Menggunakan rute yang sudah didefinisikan
  app.use(routes);

  app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
  });
};

init();

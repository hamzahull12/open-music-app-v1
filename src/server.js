require('dotenv').config();
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });
  await server.start();
  console.log(`server runing at ${server.info.uri}`);
};

init();

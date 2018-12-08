// npm start startServer  ==> starts the server with nodemon

console.log('Node Server has started');
// const http = require('http');
var https = require('https');
var fs = require('fs');
const debug = require('debug')('node-debug');
const app = require('./app');

const normalizePort = (val) => {
  var port = parseInt(val, 10);
  if (isNaN(port))
    return val;

  if (port >= 0)
    return port;

  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen")
    throw error;

  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated priviliges");
      process.exit(1);
      break;

    case "EADDRINUSE":
      console.error(bind + " already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr == "string" ? "bind" + addr : "port" + port;
  debug("listening on" + bind);
}

const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);

//Server starts
// const server = http.createServer(app);
var options = {
  key: fs.readFileSync( __dirname + '/localhost.key'),
  cert: fs.readFileSync(__dirname + '/localhost.cert'),
  requestCert: false,
  rejectUnauthorized: false
};
var server = https.createServer(options, app);

//Check for errors  & Start node debugger(onlistening)
server.on("error", onError);
server.on("listening", onListening);

server.listen(port);

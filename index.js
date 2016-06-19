var fs = require('fs');
var http = require('http');
var https = require('https');
var debug = require('debug')('test:server');
//for mongodb connection
require('./server/configurations/mongoose');
var configuration = require('./server/configuration');
var app = require('./server/configurations/server');
//for https 
var privateKey  = fs.readFileSync('./server/TLS/ryans-key.pem', 'utf8');
var certificate = fs.readFileSync('./server/TLS/ryans-cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || configuration.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
/**
 * Listen on provided port, on all network interfaces.
 */

httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

var httpsPort = normalizePort(configuration.httpsPort);
httpsServer.listen(httpsPort);
httpsServer.on('error', onError);
httpsServer.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}



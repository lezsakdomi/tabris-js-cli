const {handleErrors, fail} = require('./helpers/errorHandler');
const program = require('commander');
const {green, yellow, red, blue} = require('chalk');

program
  .command('serve [path]')
  .option('-l, --logging', 'enable request logging')
  .description('Serves a Tabris.js app from a directory or a file. If a ' +
    'build script is present in package.json, it is executed beforehand.')
  .action(handleErrors(serve));

function serve(inputPath, options) {
  const Server = require('./services/Server');

  let server = new Server();
  if (options.logging) {
    server.on('request', (req, err) => {
      if (err) {
        console.error(red(`${req.method} ${req.url} ${err.status}: "${err.message || err}"`));
      } else {
        console.info(blue(`${req.method} ${req.url}`));
      }
    });
  }
  server.serve(inputPath || process.cwd()).then(() => {
    console.info(yellow('Server started.\nPoint your Tabris.js client to:\n'),
      Server.externalAddresses.map(address => green(`  http://${address}:${server.port}`)).join('\n'));
  }).catch((err) => {
    fail(err);
  });
}

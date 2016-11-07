#!/usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json');
require('./init');

program.version(packageJson.version);
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}

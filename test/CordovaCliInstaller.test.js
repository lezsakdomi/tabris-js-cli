const {realpathSync, mkdirsSync} = require('fs-extra');
const temp = require('temp');
const {sep} = require('path');
const proc = require('../src/helpers/proc');
const CordovaCliInstaller = require('../src/services/CordovaCliInstaller');
const {expect, restore, stub} = require('./test');

describe('CordovaCliInstaller', function() {

  afterEach(restore);

  describe('installCordovaCli', function() {

    it('returns cordova path if it exists', function() {
      let dir = realpathSync(temp.mkdirSync('foo'));
      mkdirsSync(`${dir}${sep}cordova${sep}6.5.0${sep}node_modules${sep}.bin${sep}cordova`);

      let installer = new CordovaCliInstaller(dir);

      let path = installer.install('6.5.0');
      expect(path).to.equal(`${dir}${sep}cordova${sep}6.5.0${sep}node_modules${sep}.bin${sep}cordova`);
    });

    it('installs cordova if it does not exist', function() {
      let dir = realpathSync(temp.mkdirSync('foo'));

      stub(proc, 'execSync')
        .withArgs('npm', ['install', 'cordova@6.5.0'], {cwd: `${dir}${sep}cordova${sep}6.5.0`})
        .returns({status: 0});

      let installer = new CordovaCliInstaller(dir);

      let path = installer.install('6.5.0');
      expect(path).to.equal(`${dir}${sep}cordova${sep}6.5.0${sep}node_modules${sep}.bin${sep}cordova`);
    });

    it('throws an error if npm process returns non-0 exit code', function() {
      let dir = realpathSync(temp.mkdirSync('foo'));

      stub(proc, 'execSync')
        .withArgs('npm', ['install', 'cordova@6.5.0'], {cwd: `${dir}${sep}cordova${sep}6.5.0`})
        .returns({status: 1});

      let installer = new CordovaCliInstaller(dir);

      expect(() => installer.install('6.5.0')).to.throw('Error installing Cordova CLI.');
    });

  });

});

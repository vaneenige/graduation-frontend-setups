// Node packages
const ncp = require('ncp').ncp;
const rimraf = require('rimraf');

// Custom config files
const config = require('../config');

const exit = (message = '') => {
  console.log(message);
  return process.exit(1);
};

const debug = (message) => {
  if (process.env.DEBUG === 'true') {
    console.log(`DEBUG - ${message}`);
  }
};

module.exports.exit = exit;
module.exports.debug = debug;

module.exports.removeFiles = (files = [], callback) => {
  console.log('Cleaning up...')
  const fileAmount = files.length;
  let index = 0;
  let file = files[index];

  const nextFile = () => {
    
    index += 1;

    if (index != fileAmount) {
      file = files[index];
      removeFile(file);
    } else {
      callback();
    }
  };

  const removeFile = (file) => {
    if (typeof file === 'undefined') {
      return;
    }

    if (file != config.tempDirectoryName) {
      rimraf(file, () => {
        debug(`${file} removed`);
        nextFile();
      });
    } else {
      nextFile();
    }
  };

  removeFile(file);
};

module.exports.moveTempFiles = (callback) => {
  ncp(`./${config.tempDirectoryName}`, `.`, (err) => {
    if (err) {
      exit(err);
    }
    
    debug(`${config.tempDirectoryName} content copied`);

    rimraf(config.tempDirectoryName, () => {
      debug(`${config.tempDirectoryName} removed`);
      callback();
    });
  });
};

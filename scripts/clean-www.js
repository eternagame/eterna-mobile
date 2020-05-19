const shell = require('shelljs');

module.exports = context => {
    shell.rm('-r', 'www/*');
};

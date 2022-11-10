const fs = require('fs');
const path = require('path');


// Or you could read manually without using require
const envConfigFile = path.join(__dirname, '..', '..', `config.json`);
const config = JSON.parse(fs.readFileSync(envConfigFile, 'utf-8'));
module.exports = { config };

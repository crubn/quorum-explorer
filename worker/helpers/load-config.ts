
// Or you could read manually without using require
// const envConfigFile = path.join(__dirname, '..', '..', `config.json`);

const config = JSON.parse(process.env.CONFIG_STRING ?
    process.env.CONFIG_STRING : JSON.stringify({}));
module.exports = { config };

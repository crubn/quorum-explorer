
// const defaultConfig = require("../../config/config.json");

export function configReader() {
  // if (process.env.QE_CONFIG_PATH) {
  //   const data = await fs.promises.readFile(
  //     `${process.env.QE_CONFIG_PATH}`,
  //     "utf8"
  //   );
  //   return data;
  // } else {
  return process.env.CONFIG_STRING ?? JSON.stringify({});
  // }
}

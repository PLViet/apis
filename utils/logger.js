const chalk = require("chalk");
module.exports = (data, type) => {
  const arrayColor = [
    "blue",
    "yellow",
    "green",
    "red",
    "magenta",
    "yellowBright",
    "blueBright",
    "magentaBright",
    "cyan",
    "gray",
  ];
  const arrayColor1 = [
    "blue",
    "gray",
    "yellow",
    "magenta",
    "green",
    "magentaBright",
    "blueBright",
    "red",
    "yellowBright",
    "cyan",
  ];
  const color_one =
    chalk[arrayColor[Math.floor(Math.random() * arrayColor.length)]];
  const color_two =
    chalk[arrayColor1[Math.floor(Math.random() * arrayColor1.length)]];
  console.log(color_one(`[ ${type} ] -> `) + color_two(data));
};
module.exports.banner = (data) => {
  const rdcl = [
    "blue",
    "yellow",
    "cyan",
    "green",
    "red",
    "magenta",
    "yellowBright",
    "blueBright",
    "magentaBright",
  ];
  const color = chalk[rdcl[Math.floor(Math.random() * rdcl.length)]];
  console.log(color(data));
};

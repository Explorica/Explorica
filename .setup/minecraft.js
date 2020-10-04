const { join } = require("path");
const {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} = require("fs");
const moment = require("moment");
const minecraftPlugins = require("./minecraftPlugins");

/* -------------------------------------------------------------------------- */
/*                                  Minecraft                                 */
/* -------------------------------------------------------------------------- */

module.exports = (mysqlUser, minecraftUser, eula) => {
  const dir = join(__dirname, "../minecraft");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  eulaTxt(eula);
  serverProperties();
  opsJson(minecraftUser);
  bukkitYml();
  spigotYml();
  paperYml();
  commandsYml(minecraftUser);
  serverIconPng();
  minecraftPlugins(mysqlUser, minecraftUser);
};

/* -------------------------------- eula.txt -------------------------------- */

const eulaTxt = (eula) => {
  let data = readFileSync(
    join(__dirname, "./templates/minecraft/eula.txt")
  ).toString();
  const now = moment().utc();
  const dateString = `${now.format("ddd MMM DD HH:mm:ss")} UTC ${now.format(
    "YYYY"
  )}`;
  data = data.replace("%DATE%", dateString);
  data = data.replace("%EULA%", eula);
  writeFileSync(join(__dirname, "../minecraft/eula.txt"), data);
};

/* ---------------------------- server.properties --------------------------- */

const serverProperties = () => {
  let data = readFileSync(
    join(__dirname, "./templates/minecraft/server.properties")
  ).toString();
  const now = moment().utc();
  const dateString = `${now.format("ddd MMM DD HH:mm:ss")} UTC ${now.format(
    "YYYY"
  )}`;
  data = data.replace("%DATE%", dateString);
  writeFileSync(join(__dirname, "../minecraft/server.properties"), data);
};

/* -------------------------------- ops.json -------------------------------- */

const opsJson = async (minecraftUser) => {
  const data = JSON.stringify(
    [
      {
        uuid: minecraftUser.formattedUUID,
        name: minecraftUser.username,
        level: 4,
        bypassesPlayerLimit: true,
      },
    ],
    null,
    4
  );
  writeFileSync(join(__dirname, "../minecraft/ops.json"), data);
};

/* ------------------------------- bukkit.yml ------------------------------- */

const bukkitYml = () => {
  const data = readFileSync(
    join(__dirname, "./templates/minecraft/bukkit.yml")
  ).toString();
  writeFileSync(join(__dirname, "../minecraft/bukkit.yml"), data);
};

/* ------------------------------- spigot.yml ------------------------------- */

const spigotYml = () => {
  const data = readFileSync(
    join(__dirname, "./templates/minecraft/spigot.yml")
  ).toString();
  writeFileSync(join(__dirname, "../minecraft/spigot.yml"), data);
};

/* -------------------------------- paper.yml ------------------------------- */

const paperYml = () => {
  const data = readFileSync(
    join(__dirname, "./templates/minecraft/paper.yml")
  ).toString();
  writeFileSync(join(__dirname, "../minecraft/paper.yml"), data);
};

/* ------------------------------ commands.yml ------------------------------ */

const commandsYml = (minecraftUser) => {
  let data = readFileSync(
    join(__dirname, "./templates/minecraft/commands.yml")
  ).toString();
  data = data.replace("%MINECRAFT_USERNAME%", minecraftUser.username);

  writeFileSync(join(__dirname, "../minecraft/commands.yml"), data);
};

/* ----------------------------- server-icon.png ---------------------------- */

const serverIconPng = () => {
  copyFileSync(
    join(__dirname, "./templates/minecraft/server-icon.png"),
    join(__dirname, "../minecraft/server-icon.png")
  );
};

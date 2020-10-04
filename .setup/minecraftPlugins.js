const path = require("path");
const {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
  createReadStream,
  createWriteStream,
  unlinkSync,
} = require("fs");
const { createGzip } = require("zlib");
const { pipeline } = require("stream");
const moment = require("moment");
const glob = require("glob");

module.exports = (mysqlUser, minecraftUser) => {
  const dir = path.join(__dirname, "../minecraft/plugins");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  glob
    .sync(path.join(__dirname, "./templates/minecraft/plugins/*.jar"))
    .forEach((filename) => {
      copyFileSync(
        filename,
        path.join(__dirname, "../minecraft/plugins/", path.basename(filename))
      );
    });

  luckPerms(mysqlUser, minecraftUser);
  ventureChat(mysqlUser);
  placeholderApi();
};

/* -------------------------------------------------------------------------- */
/*                                  LuckPerms                                 */
/* -------------------------------------------------------------------------- */

const luckPerms = (mysqlUser, minecraftUser) => {
  const dir = path.join(__dirname, "../minecraft/plugins/LuckPerms");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  luckPermsConfigYml(mysqlUser);
  luckPermsImportJsonGz(minecraftUser);
};

/* ------------------------------- config.yml ------------------------------- */

const luckPermsConfigYml = (mysqlUser) => {
  let data = readFileSync(
    path.join(__dirname, "./templates/minecraft/plugins/LuckPerms/config.yml")
  ).toString();
  data = data.replace('"%MYSQL_USERNAME%"', mysqlUser.name);
  data = data.replace('"%MYSQL_USERPASS%"', mysqlUser.password);
  writeFileSync(
    path.join(__dirname, "../minecraft/plugins/LuckPerms/config.yml"),
    data
  );
};

/* ----------------------------- import.json.gz ----------------------------- */

const luckPermsImportJsonGz = (minecraftUser) => {
  let data = JSON.parse(
    readFileSync(
      path.join(
        __dirname,
        "./templates/minecraft/plugins/LuckPerms/import.json"
      )
    ).toString()
  );
  const now = moment().utc();
  const metadata = {
    generatedBy: minecraftUser.username,
    generatedAt: `${now.format("YYYY-MM-DD HH:mm:ss")} UTC`,
  };
  const users = {};
  data = JSON.stringify({ metadata, ...data, users }, null, 4);
  writeFileSync(
    path.join(__dirname, "../minecraft/plugins/LuckPerms/import.json"),
    data
  );
  const gzip = createGzip();
  const source = createReadStream(
    path.join(__dirname, "../minecraft/plugins/LuckPerms/import.json")
  );
  const destination = createWriteStream(
    path.join(__dirname, "../minecraft/plugins/LuckPerms/import.json.gz")
  );

  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error(err);
    }
  });

  unlinkSync(
    path.join(__dirname, "../minecraft/plugins/LuckPerms/import.json")
  );
};

/* -------------------------------------------------------------------------- */
/*                                 VentureChat                                */
/* -------------------------------------------------------------------------- */

const ventureChat = (mysqlUser) => {
  const dir = path.join(__dirname, "../minecraft/plugins/VentureChat");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  ventureChatConfigYml(mysqlUser);
};

/* ------------------------------- config.yml ------------------------------- */

const ventureChatConfigYml = (mysqlUser) => {
  let data = readFileSync(
    path.join(__dirname, "./templates/minecraft/plugins/VentureChat/config.yml")
  ).toString();
  data = data.replace('"%MYSQL_USERNAME%"', mysqlUser.name);
  data = data.replace('"%MYSQL_USERPASS%"', mysqlUser.password);
  writeFileSync(
    path.join(__dirname, "../minecraft/plugins/VentureChat/config.yml"),
    data
  );
};

/* -------------------------------------------------------------------------- */
/*                               PlaceholderAPI                               */
/* -------------------------------------------------------------------------- */

const placeholderApi = () => {
  let dir = path.join(__dirname, "../minecraft/plugins/PlaceholderAPI");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  dir = path.join(__dirname, "../minecraft/plugins/PlaceholderAPI/expansions");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  glob
    .sync(
      path.join(
        __dirname,
        "./templates/minecraft/plugins/PlaceholderAPI/expansions/*.jar"
      )
    )
    .forEach((filename) => {
      copyFileSync(
        filename,
        path.join(
          __dirname,
          "../minecraft/plugins/PlaceholderAPI/expansions/",
          path.basename(filename)
        )
      );
    });
};

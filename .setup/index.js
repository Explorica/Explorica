const path = require("path");
const { readFileSync, writeFileSync } = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const minecraft = require("./minecraft");
const { getMinecraftUser, generateMysqlUser } = require("./util");

inquirer
  .prompt([
    {
      name: "minecraft_eula",
      type: "confirm",
      message:
        "By confirming, you agree to the Minecraft Server EULA (https://account.mojang.com/documents/minecraft_eula).\n  You also agree that tacos are tasty, and the best food in the world.",
    },
    {
      name: "minecraft_username",
      type: "input",
      message:
        "Please enter your Minecraft username.\n  This will be used to set you as server op and create your website account.\n  PLEASE ENTER YOUR ACTUAL USERNAME.\n  This is validated against the Minecraft authentication servers.",
    },
  ])
  .then(async (answers) => {
    const mysqlUser = generateMysqlUser();
    const minecraftUser = await getMinecraftUser(answers.minecraft_username);
    dotEnv(mysqlUser);
    minecraft(mysqlUser, minecraftUser, answers.minecraft_eula);
    console.log(
      chalk.yellow(
        "\n\nYour Explorica configuration files have been generated!"
      )
    );
    console.log("\n\nNext steps:");
    console.log(
      chalk.gray("\t- View the .env file and make any needed changes.")
    );
    console.log(
      chalk.gray("\t- Build the servers: ") + chalk.blue("npm run build")
    );
    console.log(
      chalk.gray("\t- Start the servers: ") + chalk.blue("npm run start")
    );
  })
  .catch((err) => {
    if (!err.isTtyError) {
      console.error(err);
    }
  });

/* ---------------------------------- .env ---------------------------------- */

const dotEnv = (mysqlUser) => {
  let data = readFileSync(path.join(__dirname, "./templates/.env")).toString();
  data = data.replace("%MYSQL_ROOTPASS%", mysqlUser.rootPassword);
  data = data.replace("%MYSQL_USERNAME%", mysqlUser.name);
  data = data.replace("%MYSQL_USERPASS%", mysqlUser.password);
  writeFileSync(path.join(__dirname, "../.env"), data);
};

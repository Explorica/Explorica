const axios = require("axios");

const getMinecraftUser = async (username) => {
  const req = await axios.get(
    `https://api.mojang.com/users/profiles/minecraft/${username}`
  );
  const formattedUUID = `${req.data.id.substring(0, 8)}-${req.data.id.substring(
    8,
    12
  )}-${req.data.id.substring(12, 16)}-${req.data.id.substring(
    16,
    20
  )}-${req.data.id.substring(20, 36)}`;

  return { username: req.data.name, uuid: req.data.id, formattedUUID };
};

const generateString = (length) => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, length);
};

const generateMysqlUser = () => {
  return {
    name: generateString(16),
    password: generateString(16),
    rootPassword: generateString(16),
  };
};

module.exports = { getMinecraftUser, generateString, generateMysqlUser };

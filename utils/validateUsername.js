import { User } from "../models/User.js";

export const validateUsername = async (username) => {
  const user = await User.findOne({ username });

  if (user) {
    // generate username
    username += (+new Date() * Math.random()).toString().substring(0, 1);
    return validateUsername(username);
  }

  return username;
};

const { NODE_ENV } = require("./config");

const cookiesConfig = (lifetime) => {
  const cookieConfig = {
    httpOnly: true,
    secure: NODE_ENV !== "test",
    signed: true,
    expires: new Date(Date.now() + lifetime),
    sameSite: "none",
  };

  return cookieConfig;
};

module.exports = cookiesConfig;

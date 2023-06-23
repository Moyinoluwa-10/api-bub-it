const createTokenUser = (user) => {
  return { name: user.fullName, userId: user._id, role: user.role };
};

module.exports = createTokenUser;

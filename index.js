const app = require("./app");
const { PORT } = require("./config/config");
const { connectToMongoDB } = require("./database/db");

// connect to MongoDB
connectToMongoDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on: https://localhost:${PORT}`);
});

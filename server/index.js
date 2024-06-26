const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 3000;

const routes = require("./routes/routes");
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.use("/itinerary", routes);

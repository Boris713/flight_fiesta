const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios").default;
const { exec } = require("child_process");
const { bodyParser } = require("body-parser");
const { error } = require("console");
const { stdout, stderr } = require("process");

router.get("/activities", async (req, res) => {
  const { latitude, longitude, kinds } = req.query;
  const baseUrl = "https://api.opentripmap.com/0.1/en/places/radius";
  const params = {
    radius: 15000,
    lon: longitude,
    lat: latitude,
    kinds: kinds,
    apikey: process.env.MAP_API_KEY,
  };
  const urlWithParams = `${baseUrl}?${new URLSearchParams(params).toString()}`;
  try {
    const response = await axios.get(baseUrl, { params });
    res.json(response.data);
  } catch (error) {
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    res.status(500).send("Failed to fetch data");
  }
});

router.post("/register", async (req, res) => {
  const { id, email, name } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name || "User",
      },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      res.status(409).json("A user with this email already exists.");
    } else {
      console.error(error);
      res.status(500).json("Error creating user");
    }
  }
});

router.post("/update-points", async (req, res) => {
  const { userId, category, score } = req.body;
  try {
    const existingActivity = await prisma.Interest.findUnique({
      where: { userId_Activity: { userId, category } },
    });

    if (existingActivity) {
      await prisma.Interest.update({
        where: { userId_Activity: { userId, category } },
        data: { score: existingActivity.score + score },
      });
    } else {
      await prisma.Interest.create({
        data: { userId, category, score },
      });
    }
    res.status(200).send("Activity logged");
  } catch (error) {
    res.status(500).send("Error");
  }
});

router.get("/recommendations", async (req, res) => {
  console.log("Request received with params:", req.query);
  const { userId, cityId } = req.query;
  console.log(
    `Fetching recommendations for userId: ${userId} and cityId: ${cityId}`
  );
  try {
    const userInterests = await prisma.interest.findMany({
      where: { userId: userId },
    });
    const cityInterests = await prisma.interest.findMany({
      where: { cityId: parseInt(cityId) },
    });

    if (userInterests.length === 0 || cityInterests.length === 0) {
      console.log("No interests found.");
      return res.status(404).send("No interests found.");
    }

    const data = {
      userId: userId,
      userInterests: userInterests,
      cityInterests: cityInterests,
      cityId: cityId,
    };
    const dataString = JSON.stringify(data);
    const scriptPath =
      "/Users/borishernandez/Desktop/Meta/Meta_Capstone/server/python/recommend.py";
    const pythonProcess = exec(`/usr/bin/python3 ${scriptPath}`);
    pythonProcess.stdin.write(dataString);
    pythonProcess.stdin.end();

    let pythonOutput = "";
    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data;
    });
    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        return res.status(500).send("Error generating recommendations");
      }
      try {
        const recommendations = JSON.parse(pythonOutput);
        res.json(recommendations);
      } catch (parseError) {
        console.error("Failed to parse recommendations:", parseError);
        res.status(500).send("Server error: Failed to parse recommendations");
      }
    });
  } catch (error) {
    console.error("Failed to fetch interests:", error);
    res.status(500).send("Failed to fetch interests");
  }
});

module.exports = router;

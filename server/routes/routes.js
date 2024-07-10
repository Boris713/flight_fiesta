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
  const { userId } = req.query;
  try {
    exec(
      `python3 ../python/recommend.py ${userId}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send("Error generating recommendations");
        }
      }
    );
    const recommendations = JSON.parse(stdout);
    res.json(recommendations);
  } catch (error) {
    console.error(`Server error: ${error}`);
    res.status(500).send("Error recommending");
  }
});

module.exports = router;

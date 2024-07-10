const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios").default;

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
module.exports = router;

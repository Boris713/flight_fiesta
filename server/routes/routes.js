const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios").default;
const { exec } = require("child_process");
const {
  fetchActivities,
  getDetailedActivity,
} = require("../utils/ItineraryUtils");
router.get("/activities", async (req, res) => {
  const { latitude, longitude, kinds } = req.query;

  try {
    const data = await fetchActivities(latitude, longitude, kinds);
    res.json(data);
  } catch (error) {
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    res.status(500).send("Failed to fetch data");
  }
});

router.get("/activity-detail/:xid", async (req, res) => {
  const { xid } = req.params;

  try {
    const activityDetail = await getDetailedActivity(xid);
    res.status(200).json(activityDetail);
  } catch (error) {
    console.error(
      `Error in /activity-detail/:xid for xid ${xid}:`,
      error.message
    );
    res.status(500).json({ error: "Error fetching activity details" });
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
  const interests = req.body;

  try {
    await Promise.all(
      interests.map(async ({ userId, category, score }) => {
        const existingInterest = await prisma.interest.findFirst({
          where: {
            userId,
            category,
          },
    });

        if (existingInterest) {
          await prisma.interest.update({
            where: { id: existingInterest.id },
            data: { score: existingInterest.score + score },
      });
    } else {
          await prisma.interest.create({
        data: { userId, category, score },
      });
    }
      })
    );
    res.status(200).send("Interests updated");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating interests");
  }
});

router.get("/recommendations", async (req, res) => {
  const { userId, cityId } = req.query;

  try {
    const userInterests = await prisma.interest.findMany({
      where: { userId: userId },
    });
    const cityInterests = await prisma.interest.findMany({
      where: { cityId: parseInt(cityId) },
    });

    if (userInterests.length === 0 || cityInterests.length === 0) {
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

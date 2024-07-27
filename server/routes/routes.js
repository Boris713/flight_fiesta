const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios").default;
const { exec } = require("child_process");
const {
  fillDayActivities,
  fetchActivities,
  getDetailedActivity,
  popular,
  updatePoints,
} = require("../utils/ItineraryUtils");
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

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

router.get("/image-search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: GOOGLE_API_KEY,
          cx: GOOGLE_CSE_ID,
          q: query,
          searchType: "image",
          num: 1,
        },
      }
    );

    const items = response.data.items;

    if (items && items.length > 0) {
      const imageUrl = items[0].link;
      res.json({ imageUrl, name: query });
    } else {
      res.status(404).json({ error: "No images found" });
    }
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).json({ error: "Error fetching image" });
  }
});

router.post("/save-activities", async (req, res) => {
  const activities = req.body;

  try {
    await Promise.all(
      activities.map(async (activity) => {
        const existingActivity = await prisma.activity.findUnique({
          where: { xid: activity.properties.xid }, // Ensure xid is correctly accessed
        });

        if (!existingActivity) {
          await prisma.activity.create({
            data: {
              title: activity.properties.name, // Ensure name is correctly accessed
              category: activity.properties.kinds, // Ensure kinds is correctly accessed
              startTime: new Date(),
              endTime: new Date(),
              xid: activity.properties.xid,
              image: activity.imageUrl, // Ensure imageUrl is passed correctly
              wikiLink: activity.properties.wikidata
                ? `https://www.wikidata.org/wiki/${activity.properties.wikidata}`
                : null, // Ensure wikidata is correctly accessed
            },
          });
        }
      })
    );

    res.status(200).send("Activities saved successfully");
  } catch (error) {
    console.error("Error saving activities:", error);
    res.status(500).send("Error saving activities");
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

router.post("/update-like", async (req, res) => {
  const { userId, xid, liked } = req.body;

  try {
    const existingActivity = await prisma.activity.findUnique({
      where: { xid },
      include: { users: true },
    });

    if (existingActivity) {
      await prisma.activity.update({
        where: { xid },
        data: { liked },
      });

      if (liked) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            likedActivities: {
              connect: { xid: existingActivity.xid },
            },
          },
        });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: {
            likedActivities: {
              disconnect: { xid: existingActivity.xid },
            },
          },
        });
      }

      const scoreChange = liked ? 4 : -4;
      await updatePoints(userId, existingActivity.category, scoreChange);
      await updatePoints(
        existingActivity.cityId,
        existingActivity.category,
        scoreChange,
        true
      );

      res.status(200).json({ message: "Like status updated successfully" });
    } else {
      res.status(404).json({ error: "Activity not found" });
    }
  } catch (error) {
    console.error("Error updating like status:", error);
    res.status(500).json({ error: "Error updating like status" });
  }
});

router.post("/get-like-status", async (req, res) => {
  const { userId, xid } = req.body;

  try {
    const activity = await prisma.activity.findUnique({
      where: { xid: xid },
    });

    if (!activity) {
      return res.status(404).send("Activity not found");
    }

    res.status(200).json({ liked: activity.liked });
  } catch (error) {
    console.error("Error fetching like status:", error);
    res.status(500).send("Error fetching like status");
  }
});

router.post("/update-points", async (req, res) => {
  const interests = req.body;

  try {
    await Promise.all(
      interests.map(async (interest) => {
        const isCity = interest.cityId !== undefined;
        const entityId = isCity ? interest.cityId : interest.userId;
        await updatePoints(entityId, interest.category, interest.score, isCity);
      })
    );

    res.status(200).json({ message: "Points updated successfully" });
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ error: "Error updating points" });
  }
});
router.get("/liked-activities", async (req, res) => {
  const { userId } = req.query;

  try {
    const likedActivities = await prisma.activity.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        liked: true,
      },
      include: {
        users: true,
      },
    });

    res.status(200).json(likedActivities);
  } catch (error) {
    console.error("Error fetching liked activities:", error);
    res.status(500).send("Error fetching liked activities");
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

router.post("/save", async (req, res) => {
  const { userId, cityId, title, description, startDate, endDate, activities } =
    req.body;

  try {
    const newItinerary = await prisma.itinerary.create({
      data: {
        userId,
        cityId,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        activities: {
          create: activities.map((activity) => ({
            title: activity.title,
            category: activity.category,
            startTime: new Date(activity.startTime),
            endTime: new Date(activity.endTime),
            xid: activity.xid,
            image: activity.image,
            wikiLink: activity.wikiLink,
          })),
        },
      },
    });

    res.status(200).json(newItinerary);
  } catch (error) {
    console.error("Failed to save itinerary:", error);
    res.status(500).send(`Error saving itinerary: ${error.message}`);
  }
});

router.get("/generate", async (req, res) => {
  const { startDate, endDate, interests, type, latitude, longitude, cityId } =
    req.query;

  try {
    const parsedInterests = interests ? JSON.parse(interests) : [];

    let popularActivitiesResponse = await popular(latitude, longitude, cityId);

    let popularActivities = popularActivitiesResponse.features;

    let start = new Date(startDate);
    let end = new Date(endDate);
    let dayCount = Math.ceil((end - start) / (1000 * 3600 * 24)) + 1;

    let detailedPopularActivities = [];

    // Fetch details for each popular activity, but only up to the number of days
    for (let i = 0; i < dayCount && i < popularActivities.length; i++) {
      const activity = popularActivities[i];
      const details = await getDetailedActivity(activity.properties.xid);
      detailedPopularActivities.push(details);
    }

    if (detailedPopularActivities.length < dayCount * 6) {
      popularActivitiesResponse = await popular(
        latitude,
        longitude,
        cityId,
        30000
      );

      popularActivities = popularActivitiesResponse.features;

      detailedPopularActivities = [];
      for (let i = 0; i < dayCount && i < popularActivities.length; i++) {
        const activity = popularActivities[i];
        const details = await getDetailedActivity(activity.properties.xid);
        detailedPopularActivities.push(details);
      }
    }

    let itinerary1 = [];
    let itinerary2 = [];
    let usedActivities = new Set();

    while (dayCount > 0 && detailedPopularActivities.length > 0) {
      const format = type; // Use selected itinerary type
      const centralActivity = detailedPopularActivities.shift(); // Get a unique central activity for each day

      if (usedActivities.has(centralActivity.xid)) {
        continue; // Skip if the activity has already been used
      }
      usedActivities.add(centralActivity.xid);

      // Fetch additional activities based on the central activity's location
      const additionalPopularActivitiesResponse = await fetchActivities(
        centralActivity.point.lat,
        centralActivity.point.lon,
        parsedInterests.join(","),
        30000
      );

      const additionalPopularActivities =
        additionalPopularActivitiesResponse.features || [];

      // Fetch recommended activities
      const additionalRecommendedActivitiesResponse = await fetchActivities(
        centralActivity.point.lat,
        centralActivity.point.lon,
        parsedInterests.join(","),
        30000
      );

      const additionalRecommendedActivities =
        additionalRecommendedActivitiesResponse.features || [];

      // Filter out used activities from additional activities
      const filteredPopularActivities = additionalPopularActivities.filter(
        (activity) => !usedActivities.has(activity.properties.xid)
      );
      const filteredRecommendedActivities =
        additionalRecommendedActivities.filter(
          (activity) => !usedActivities.has(activity.properties.xid)
        );

      // Get a random template from the database
      const templates = await prisma.template.findMany({
        where: { type: format },
        orderBy: { id: "desc" },
      });

      if (templates.length === 0) {
        throw new Error("No templates found for the specified format");
      }

      const template = templates[Math.floor(Math.random() * templates.length)];
      const times = template.times;

      const dayActivities1 = fillDayActivities(
        centralActivity,
        filteredPopularActivities,
        filteredRecommendedActivities,
        format,
        0.8,
        0.2,
        times,
        usedActivities // Pass the used activities set to update it within fillDayActivities
      );

      const dayActivities2 = fillDayActivities(
        centralActivity,
        filteredPopularActivities,
        filteredRecommendedActivities,
        format,
        0.2, // 20% popular, 80% recommendations
        0.8,
        times,
        usedActivities // Pass the used activities set to update it within fillDayActivities
      );

      itinerary1.push(dayActivities1);
      itinerary2.push(dayActivities2);

      start.setDate(start.getDate() + 1);
      dayCount--;
    }

    res.json({ itinerary1, itinerary2 });
  } catch (error) {
    console.error("Failed to generate itinerary:", error.message);
    res.status(500).send(`Error generating itinerary: ${error.message}`);
  }
});

module.exports = router;

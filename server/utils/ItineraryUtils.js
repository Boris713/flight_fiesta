const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fillDayActivities = (
  centralActivity,
  popular,
  recommended,
  format,
  popularPercentage,
  recommendedPercentage,
  times,
  usedActivities
) => {
  let itinerary = [];

  if (!usedActivities.has(centralActivity.xid)) {
    usedActivities.add(centralActivity.xid);
    itinerary.push({ activity: centralActivity, time: times[0] });
  }

  const totalActivitiesCount = times.length;
  const popularCount = Math.ceil(popularPercentage * totalActivitiesCount);
  const recommendedCount = totalActivitiesCount - popularCount;

  const selectedPopular = popular
    .filter(
      (activity) =>
        !usedActivities.has(activity.properties.xid) && activity.properties.name
    )
    .slice(0, popularCount);

  const selectedRecommended = recommended
    .filter(
      (activity) =>
        !usedActivities.has(activity.properties.xid) && activity.properties.name
    )
    .slice(0, recommendedCount);

  let activitiesIndex = 1; // Start from 1 because the 0th is for centralActivity

  selectedPopular.forEach((activity) => {
    if (activitiesIndex < times.length) {
      usedActivities.add(activity.properties.xid);
      itinerary.push({ activity, time: times[activitiesIndex] });
      activitiesIndex++;
    }
  });

  selectedRecommended.forEach((activity) => {
    if (activitiesIndex < times.length) {
      usedActivities.add(activity.properties.xid);
      itinerary.push({ activity, time: times[activitiesIndex] });
      activitiesIndex++;
    }
  });

  return itinerary;
};

const fetchActivities = async (latitude, longitude, kinds, radius) => {
  const baseUrl = "https://api.opentripmap.com/0.1/en/places/radius";
  const params = {
    radius: radius || 20000,
    lon: longitude,
    lat: latitude,
    kinds: kinds,
    apikey: process.env.MAP_API_KEY,
  };

  const retryDelay = (retryCount) => {
    return new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
  };

  let retryCount = 0;
  while (retryCount < 5) {
    try {
      const response = await axios.get(baseUrl, { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        retryCount++;
        await retryDelay(retryCount);
      } else {
        console.error("Error fetching activities:", error.message);
        throw error;
      }
    }
  }
  throw new Error("Exceeded retry limit for fetching activities");
};

const getDetailedActivity = async (xid) => {
  const url = `http://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${process.env.MAP_API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching detailed activity for xid ${xid}:`,
      error.message
    );
    throw error;
  }
};

const popular = async (latitude, longitude, cityId, radius = 20000) => {
  try {
    const topInterests = await prisma.interest.findMany({
      where: { cityId: parseInt(cityId) },
      orderBy: { score: "desc" },
      take: 5,
    });

    const kinds = topInterests.map((interest) => interest.category).join(",");

    const params = {
      radius: radius,
      lon: longitude,
      lat: latitude,
      kinds: kinds,
      rating: "2",
      apikey: process.env.MAP_API_KEY,
    };

    const response = await axios.get(
      "https://api.opentripmap.com/0.1/en/places/radius",
      { params }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching popular interests:", error.message);
    throw error;
  }
};

const updatePoints = async (
  entityId,
  category,
  scoreChange,
  isCity = false
) => {
  const whereClause = isCity
    ? { cityId: entityId, category }
    : { userId: entityId, category };
  const existingInterest = await prisma.interest.findFirst({
    where: whereClause,
  });

  if (existingInterest) {
    await prisma.interest.update({
      where: { id: existingInterest.id },
      data: { score: existingInterest.score + scoreChange },
    });
  } else {
    await prisma.interest.create({
      data: {
        [isCity ? "cityId" : "userId"]: entityId,
        category,
        score: scoreChange,
      },
    });
  }
};

module.exports = {
  fillDayActivities,
  fetchActivities,
  getDetailedActivity,
  popular,
  updatePoints,
};

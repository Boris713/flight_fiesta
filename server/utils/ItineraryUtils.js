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
  console.log("Starting fillDayActivities function");
  let itinerary = [];

  if (!usedActivities.has(centralActivity.xid)) {
    usedActivities.add(centralActivity.xid);
    itinerary.push({ activity: centralActivity, time: times[0] });
    console.log(`Added central activity: ${centralActivity.name}`);
  }

  const totalActivitiesCount = times.length;
  const popularCount = Math.ceil(popularPercentage * totalActivitiesCount);
  const recommendedCount = totalActivitiesCount - popularCount;

  console.log(`Total activities count: ${totalActivitiesCount}`);
  console.log(
    `Popular count: ${popularCount}, Recommended count: ${recommendedCount}`
  );

  const selectedPopular = popular
    .filter((activity) => !usedActivities.has(activity.properties.xid))
    .slice(0, popularCount);

  const selectedRecommended = recommended
    .filter((activity) => !usedActivities.has(activity.properties.xid))
    .slice(0, recommendedCount);

  let activitiesIndex = 1; // Start from 1 because the 0th is for centralActivity

  selectedPopular.forEach((activity) => {
    if (activitiesIndex < times.length) {
      usedActivities.add(activity.properties.xid);
      itinerary.push({ activity, time: times[activitiesIndex] });
      console.log(
        `Added popular activity: ${activity.properties.name} at time ${times[activitiesIndex]}`
      );
      activitiesIndex++;
    }
  });

  selectedRecommended.forEach((activity) => {
    if (activitiesIndex < times.length) {
      usedActivities.add(activity.properties.xid);
      itinerary.push({ activity, time: times[activitiesIndex] });
      console.log(
        `Added recommended activity: ${activity.properties.name} at time ${times[activitiesIndex]}`
      );
      activitiesIndex++;
    }
  });

  console.log("Completed fillDayActivities function");
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

  try {
    const response = await axios.get(baseUrl, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching activities:", error.message);
    throw error;
  }
};

const getDetailedActivity = async (xid) => {
  const url = `http://api.opentripmap.com/0.1/ru/places/xid/${xid}?apikey=${process.env.MAP_API_KEY}`;
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
  console.log(`Fetching popular activities for cityId: ${cityId}`);
  try {
    const topInterests = await prisma.interest.findMany({
      where: { cityId: parseInt(cityId) },
      orderBy: { score: "desc" },
      take: 5,
    });

    const kinds = topInterests.map((interest) => interest.category).join(",");
    console.log(`Top interests kinds: ${kinds}`);

    const params = {
      radius: radius,
      lon: longitude,
      lat: latitude,
      kinds: kinds,
      rating: "2",
      apikey: process.env.MAP_API_KEY,
    };

    console.log(
      `Fetching popular interests with params: ${JSON.stringify(params)}`
    );

    const response = await axios.get(
      "https://api.opentripmap.com/0.1/en/places/radius",
      { params }
    );

    console.log(
      `Fetched popular interests: ${response.data.features.length} activities found`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching popular interests:", error.message);
    throw error;
  }
};

module.exports = {
  fillDayActivities,
  fetchActivities,
  getDetailedActivity,
  popular,
};

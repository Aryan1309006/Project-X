const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");

// ── User IDs (your 10 bot accounts) ──
const USER_IDS = [
  "aaaaaaaaaaaaaaaaaaaaaaaa",
  "aaaaaaaaaaaaaaaaaaaaaaab",
  "aaaaaaaaaaaaaaaaaaaaaaac",
  "aaaaaaaaaaaaaaaaaaaaaaad",
  "aaaaaaaaaaaaaaaaaaaaaaae",
  "aaaaaaaaaaaaaaaaaaaaaaaf",
  "aaaaaaaaaaaaaaaaaaaaaaa0",
  "aaaaaaaaaaaaaaaaaaaaaaa1",
  "aaaaaaaaaaaaaaaaaaaaaaa2",
  "aaaaaaaaaaaaaaaaaaaaaaa3",
];

// ── Review comment pool by rating ──
const COMMENTS = {
  5: [
    "Ekdum mast station hai! Charging fast thi aur staff helpful tha.",
    "Best EV charging experience so far. Highly recommended!",
    "Superb location, clean area, and fast chargers. Will come again.",
    "Bahut accha hai yaar, 45 min mein full charge ho gaya.",
    "Amazing service! Plugged in, grabbed a coffee, came back to full battery.",
    "No waiting time, all chargers were free. Perfect stop.",
    "Great infrastructure, well maintained. 5 stars easily.",
    "Smooth and quick. The app showed live availability too, very convenient.",
    "First time using this station — totally impressed. Will be a regular!",
    "Clean, safe, and fast. What more can you ask for?",
  ],
  4: [
    "Good experience overall. One charger was occupied but didn't wait long.",
    "Nice station, decent speed. Parking area could be a bit bigger.",
    "Pretty good! Minor issue with the display screen but charging worked fine.",
    "Thoda wait karna pada but overall experience theek tha.",
    "4 stars because one of the CCS ports was not working, rest was good.",
    "Solid station. Location is convenient near the highway.",
    "Good speed and well-lit area at night. Felt safe.",
    "Charging was smooth. Amenities nearby are a plus.",
    "Acha station hai, bas queue thodi zyada thi weekend pe.",
    "Reliable chargers. Staff was present and helpful.",
  ],
  3: [
    "Average experience. Charging took longer than expected.",
    "Station theek hai but location thodi confusing hai dhundne mein.",
    "2 out of 3 chargers were working. Manageable but could be better.",
    "Not bad, not great. Hope they improve maintenance.",
    "Charging speed was okay. Waited about 20 mins for a free port.",
    "Decent but the area around wasn't very clean.",
    "App se book kiya but station pe koi nahi tha guide karne ke liye.",
    "Middle of the road experience. Nothing special.",
    "Charger worked but stopped midway once, had to restart.",
    "It's okay for emergency charging but wouldn't make a special trip.",
  ],
  2: [
    "Charger was too slow for a fast charging station. Disappointed.",
    "Waited 30 mins and the charger gave error. Waste of time.",
    "Station ka maintenance kafi kharab hai. Ek bhi charger properly nahi chal raha.",
    "Came twice, both times at least one charger was out of order.",
    "Charging speed was very poor. 2 hours for 40%. Not acceptable.",
    "Location difficult to find and no proper signage. Frustrating.",
    "Connector type shown on app didn't match what was actually available.",
    "Overpriced for the quality of service offered here.",
    "Staff was rude when I raised a complaint. Very bad experience.",
    "Station looks new but chargers are unreliable. Fix it please.",
  ],
  1: [
    "Complete waste of time. Both chargers were broken.",
    "Gaya tha emergency mein, dono charger band the. Bahut bura laga.",
    "Worst experience ever. No one to help and chargers not working.",
    "App shows available but nothing works on ground. Misleading!",
    "Dangerous area at night. No lighting at all. Avoid after dark.",
    "Charger damaged my car's port warning — please get it checked!",
    "Came 3 times in a week, charger was broken all 3 times. Useless.",
    "Pathetic maintenance. This station should be shut down until fixed.",
    "No response from customer support either. Zero stars if possible.",
    "Total disappointment. Expected much better from this operator.",
  ],
};

// ── Realistic rating distribution per station (out of 5 reviews) ──
// Mix: mostly 4-5 stars with occasional bad ones to feel real
const RATING_PATTERNS = [
  [5, 5, 4, 4, 3],
  [5, 4, 4, 3, 5],
  [5, 5, 5, 4, 2],
  [4, 4, 3, 5, 5],
  [5, 3, 4, 4, 1],
  [5, 5, 4, 2, 4],
  [4, 5, 5, 3, 4],
  [5, 4, 4, 4, 5],
  [3, 5, 2, 5, 4],
  [5, 5, 4, 1, 4],
  [4, 4, 3, 3, 5],
  [5, 2, 5, 4, 4],
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getComment(rating) {
  return getRandom(COMMENTS[rating]);
}

function shuffleUsers(stationIndex) {
  // pick 5 unique users per station deterministically based on index
  const shifted = [...USER_IDS.slice(stationIndex % 10), ...USER_IDS.slice(0, stationIndex % 10)];
  return shifted.slice(0, 5);
}

async function seedReviews() {
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db;

  // fetch all station _ids
  const stations = await db
    .collection("evstations")
    .find({}, { projection: { _id: 1 } })
    .toArray();

  console.log(`📍 Found ${stations.length} stations`);

  // drop existing reviews to avoid duplicate index errors on re-seed
  await db.collection("reviews").deleteMany({});
  console.log("🗑️  Cleared existing reviews");

  const reviews = [];
  const pattern = RATING_PATTERNS;

  stations.forEach((station, i) => {
    const ratings = getRandom(pattern);
    const users = shuffleUsers(i);

    ratings.forEach((rating, j) => {
      reviews.push({
        userId: new mongoose.Types.ObjectId(users[j]),
        stationId: station._id,
        rating,
        comment: getComment(rating),
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000) // random within last 60 days
        ),
        updatedAt: new Date(),
      });
    });
  });

  console.log(`📝 Generating ${reviews.length} reviews...`);

  // insert in batches of 500 to avoid memory issues
  const BATCH = 500;
  for (let i = 0; i < reviews.length; i += BATCH) {
    await db.collection("reviews").insertMany(reviews.slice(i, i + BATCH));
    console.log(`   Inserted ${Math.min(i + BATCH, reviews.length)} / ${reviews.length}`);
  }

  console.log("✅ All reviews seeded successfully!");

  // update averageRating + reviewCount on each station
  console.log("⚡ Updating station averageRating and reviewCount...");

  const allReviews = await db.collection("reviews").aggregate([
    {
      $group: {
        _id: "$stationId",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  const bulkOps = allReviews.map((r) => ({
    updateOne: {
      filter: { _id: r._id },
      update: {
        $set: {
          averageRating: Math.round(r.avg * 10) / 10,
          reviewCount: r.count,
        },
      },
    },
  }));

  await db.collection("evstations").bulkWrite(bulkOps);
  console.log(`✅ Updated averageRating & reviewCount on ${bulkOps.length} stations`);

  await mongoose.disconnect();
  console.log("🔌 Disconnected. Done!");
}

seedReviews().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
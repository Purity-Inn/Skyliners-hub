const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    try {
      const playerCollection = mongoose.connection.collection("players");
      const indexes = await playerCollection.indexes();
      const jerseyUniqueIndex = indexes.find(
        (index) => index.name === "jerseyNumber_1" && index.unique
      );

      if (jerseyUniqueIndex) {
        await playerCollection.dropIndex("jerseyNumber_1");
        console.log("✅ Dropped legacy unique index on players.jerseyNumber");
      }
    } catch (indexErr) {
      console.warn("⚠️ Could not update players indexes:", indexErr.message);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
import mongoose from "mongoose";

/**
 * connect to the db with connection string as param
 */
export default (database: string) => {
  const connect = () => {
    mongoose
      .connect(database)

      .then(() => console.log(`Successfully connected to MongoDB`))
      .catch((error) => {
        console.log("Failed to connect to MongoDB: " + error.message);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on("disconnected", () => {
    console.log(`MongoDB disconnected`);
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

import mongoose from 'mongoose';
import * as redis from 'redis';


type DBInput = {
    db: string;
}

export default ({ db }: DBInput) => {

    const connect = async () => {
        await mongoose
            .connect(db, { autoIndex: true })
            .then(() => {
                return console.info(`Mongo connected 🔥`);
            })
            .catch((err) => {
                console.error(`Error connecting to database :`, err);

                return process.exit(1);
            })
    };
    connect();

    mongoose.connection.on('disconnected', connect);
}


export const redisClient = redis.createClient({ url: "redis://localhost:6379" });
export const redis_connect = async () => {

    try {
        await redisClient.connect();
        console.log("REDIS CONNECTED 🚀")
    } catch (error) {
        console.log("REDIS CONNECTION ERR");
        process.exit(1)
    }

}

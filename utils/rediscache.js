const redisClient = require("../config/redis");
const appError = require("../utils/appError");

const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
        console.log("inside getache");
    } catch (error) {
        throw new appError("Failed to retrieve data from cache", 500);
    }
};

const setCache = async (key, value, expiry = 300) => {
    try {
        console.log("hit set cache")
        await redisClient.set(
            key,
            JSON.stringify(value),
            { EX: expiry }
        );
    } catch (error) {
        throw new appError("Failed to store data in cache", 500);
    }
};

const deleteCache = async (key) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        throw new appError("Failed to delete cache", 500);
    }
};

module.exports = {
    getCache,
    setCache,
    deleteCache
};
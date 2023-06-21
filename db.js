const mongoose = require('mongoose');

const fetchData = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/authDb', { useNewUrlParser: true });
    console.log('Connected to MongoDB');

    const fetchedData = await mongoose.connection.db.collection("items").find({}).toArray();

    return {
      items: fetchedData
    };

  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

module.exports = fetchData;

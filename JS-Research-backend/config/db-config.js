import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default dbConnect;
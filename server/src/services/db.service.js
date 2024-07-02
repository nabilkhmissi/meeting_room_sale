const { mongoose } = require("mongoose");

module.exports = connectDB = () => {
    mongoose.set("strictQuery", true);
    mongoose.connect('mongodb://localhost:27017/Meeting_room',)
        .then(() => console.log("DB connected..."))
        .catch((err) => console.log(err))
}
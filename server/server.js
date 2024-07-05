const express = require("express");
const cors = require("cors");
const roomRoute = require("./src/routes/room");
const userRoute = require("./src/routes/user");
const eventRoute = require("./src/routes/event");
const db_init = require("./src/services/db.service");
const path = require("path");
const { UserModel } = require("./src/models");
const bcrypt = require("bcryptjs")
const app = express();
app.use(cors());
app.use(express.json());
db_init();

app.use("/images", express.static(path.join("./src/static/images")));
app.use("/roomImages", express.static(path.join("./src/static/roomImages")));


app.use("/api/material/room/tablette", roomRoute);
app.use("/api/material/user", userRoute);
app.use("/api/material/event", eventRoute);

initAdminAccount();

async function initAdminAccount() {
    try {
        const existAdmin = await UserModel.findOne({ email : "admin@mail.com" });
        if(existAdmin){
            return;
        }
        const hashedPassword = await bcrypt.hash("admin", 10);
        const admin = await UserModel({
            email : "admin@mail.com",
            password : hashedPassword,
            role : "Admin",
            name : "Admin"
        })
        await admin.save();
        console.log("---------- ADMIN ACCOUNT CREATED -----------");
    } catch (error) {
        console.log(error);
        // return res.status(500).send({ message : error })
    }
}

const PORT = 3009;

app.listen(PORT, () => console.log("Server listening on port " + PORT));
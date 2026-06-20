const express = require("express");
const ConnectDb = require("./config/db");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const listRoutes = require("./routes/list.routes");
const contactRoutes = require("./routes/contact.routes");


const port = process.env.PORT;
const frontEndUri = process.env.FRONTEND_URL;

app.use(express.json())
app.use(cors({
    origin: frontEndUri,
    credentials: true
}))


app.use("/api/list",listRoutes);
app.use("/api/contact",contactRoutes)


ConnectDb().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
});

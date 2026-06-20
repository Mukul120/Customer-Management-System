require("dotenv").config();

const express = require("express");
const ConnectDb = require("./config/db");
const cors = require("cors");
const listRoutes = require("./routes/list.routes");
const contactRoutes = require("./routes/contact.routes");
const importRoute = require("./routes/import.routes");
const { startWorker } = require("./workers/importContact");

const app = express();
const port = process.env.PORT;
const frontEndUri = process.env.FRONTEND_URL;

app.use(express.json({ limit: "10mb" }));
app.use(cors({
    origin: frontEndUri,
    credentials: true,
}));

app.use("/api/list", listRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/bulk-import", importRoute);

ConnectDb().then(() => {
    console.log("Database connection established. Starting worker...");
    startWorker().catch((error) => {
        console.error("Failed to start worker inside server:", error.message);
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

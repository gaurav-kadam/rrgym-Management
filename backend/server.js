const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const initDb = require("./config/initdb");

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.PROD_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS blocked: origin " + origin + " not allowed"));
        }
    },
    credentials: true,
}));

app.use(require("helmet")({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(require("compression")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/assets", express.static("assets"));
app.use("/uploads", (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express.static("uploads"));

const PORT = process.env.PORT || 5000;

(async () => {
    await initDb();

    const chatbotRoutes         = require("./routes/chatbot");
    const existingMembersRoutes = require("./routes/existingMembers");
    const membersRoutes         = require("./routes/memberRoutes");
    const sendRoutes            = require("./routes/sendRoutes");
    const authRoutes            = require("./routes/authRoutes");
    const adminRoutes           = require("./routes/adminRoutes");
    const attendanceRoutes      = require("./routes/attendanceRoutes");
    const planRoutes            = require("./routes/planRoutes");
    const paymentRoutes         = require("./routes/paymentRoutes");

    require("./config/membershipCron");

    app.use("/api/chatbot",          chatbotRoutes);
    app.use("/api/send",             sendRoutes);
    app.use("/api/existing-members", existingMembersRoutes);
    app.use("/api/members",          membersRoutes);
    app.use("/api/auth",             authRoutes);
    app.use("/api/admin",            adminRoutes);
    app.use("/api/attendance",       attendanceRoutes);
    app.use("/api/plans",            planRoutes);
    app.use("/api/payments",         paymentRoutes);

    app.get("/api/health", (req, res) => {
        res.status(200).send("HI Sandip I am working");
    });

    // app.use("/assets", express.static("assets"));

    app.use("/public", express.static("public"));

        

    app.use((err, req, res, next) => {
        if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "File too large. Maximum size is 2MB." });
        if (err.message === "Only image files are allowed") return res.status(400).json({ message: err.message });
        console.error("Unhandled error:", err);
        res.status(500).json({ message: "Internal server error" });
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment : ${process.env.NODE_ENV || "development"}`);
        console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
    });
})();

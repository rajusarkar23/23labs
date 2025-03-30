import "dotenv/config"
import express from "express";
import cookieParser from "cookie-parser"

const app = express();
const PORT = process.env.PORT || 8888

// allow cookie
app.use(cookieParser())
// allow json
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Fit life gym's backend is up and runnign on port ${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Hello there!!, via backend serevr.")
})

// routes
import memberRouter from "./routes/member.route"
app.use("/api/v1", memberRouter)
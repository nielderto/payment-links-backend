import 'dotenv/config';
import express from "express";
import cors from "cors";
import getLinks from './routes/get-links';
import createLinks from './routes/create-links';
import deleteLinks from './routes/delete-links';
import updateLinks from './routes/update-links';
import register from './routes/register';
import login from './routes/login';
import publicLink from './routes/public-link';
import { authMiddleware } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/v1/register", register);
app.use("/api/v1/login", login);
app.use("/api/v1/pay", publicLink);

app.use("/api/v1/links", authMiddleware, getLinks);
app.use("/api/v1/links", authMiddleware, createLinks);
app.use("/api/v1/links", authMiddleware, deleteLinks);
app.use("/api/v1/links", authMiddleware, updateLinks);

app.get("/", (req, res) => {
    res.send("Payment Links API");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

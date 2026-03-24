import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "email and password are required" });
        return;
    }

    try {
        // Find user by email
        const result = await db.select().from(users).where(eq(users.email, email));
        if (result.length === 0) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const user = result[0];
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Compare the plain text password with the hashed one
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Create a JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.error("Failed to login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
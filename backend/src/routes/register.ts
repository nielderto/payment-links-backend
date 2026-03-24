import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: "name, email, and password are required" });
        return;
    }

    try {
        // Check if email already exists
        const existing = await db.select().from(users).where(eq(users.email, email));
        if (existing.length > 0) {
            res.status(409).json({ message: "Email already registered" });
            return;
        }

        // Hash the password — NEVER store plain text
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        }).returning();

        const user = newUser[0];
        
        if (!user) {
            res.status(500).json({ message: "Failed to create user" });
            return;
        }

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
    } catch (error) {
        console.error("Failed to register user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
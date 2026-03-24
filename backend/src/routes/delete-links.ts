import express from "express";
import { links } from "../db/schema/links";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { AuthRequest } from "../middleware/auth";

const router = express.Router();

router.delete("/:linkCode", async (req: AuthRequest, res) => {
    const linkCode = req.params.linkCode;
    const userId = req.userId;

    if (!userId || !linkCode || typeof linkCode !== "string") {
        res.status(400).json({ message: "Invalid request" });
        return;
    }

    try {
        const link = await db.select().from(links).where(
            and(eq(links.linkCode, linkCode), eq(links.userId, userId))
        );

        if (link.length === 0) {
            res.status(404).json({ message: "Link not found" });
            return;
        }

        await db.delete(links).where(
            and(eq(links.linkCode, linkCode), eq(links.userId, userId))
        );

        res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
        console.error("Failed to delete link:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;

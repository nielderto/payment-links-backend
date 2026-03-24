import express from "express";
import { links } from "../db/schema/links";
import { db } from "../db";
import { eq, and } from "drizzle-orm";

const router = express.Router();

router.get("/:linkCode", async (req, res) => {
    const linkCode = req.params.linkCode;

    if (!linkCode || typeof linkCode !== "string") {
        res.status(400).json({ message: "Invalid link code" });
        return;
    }

    try {
        const link = await db.select().from(links).where(
            and(eq(links.linkCode, linkCode), eq(links.isActive, true))
        );

        if (link.length === 0) {
            res.status(404).json({ message: "Link not found" });
            return;
        }

        res.status(200).json({ link: link[0] });
    } catch (error) {
        console.error("Failed to fetch public link:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;

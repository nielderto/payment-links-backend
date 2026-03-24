import express from "express";
import { links } from "../db/schema/links";
import { db } from "../db";
import { eq, ilike, or } from "drizzle-orm";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const allLinks = await db.select().from(links).limit(5);
        res.status(200).json({"message": "Links fetched successfully", "links": allLinks});
    } catch (error) {
        console.error("Failed to fetch links:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/search", async (req, res) => {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
        res.status(400).json({ message: "Search query is required" });
        return;
    }

    try {
        const results = await db.select().from(links).where(
            or(
                eq(links.linkCode, `product-${q}`),
                ilike(links.productName, `%${q}%`)
            )
        );

        res.status(200).json({ message: "Search results", links: results });
    } catch (error) {
        console.error("Failed to search links:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:linkCode", async (req, res) => {
    const { linkCode } = req.params;

    try {
        const link = await db.select().from(links).where(eq(links.linkCode, linkCode));

        if (link.length === 0) {
            res.status(404).json({"message": "Link not found"});
            return;
        }

        res.status(200).json({"message": "Link fetched successfully", "link": link[0]});
    } catch (error) {
        console.error("Failed to fetch link:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
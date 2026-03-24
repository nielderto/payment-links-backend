import express from "express";
import { links } from "../db/schema/links";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { AuthRequest } from "../middleware/auth";

const router = express.Router();

router.put("/:linkCode", async (req: AuthRequest, res) => {
    const linkCode = req.params.linkCode;
    const userId = req.userId;

    if (!userId || !linkCode || typeof linkCode !== "string") {
        res.status(400).json({ message: "Invalid request" });
        return;
    }

    const { productName, productDescription, price, imageUrl, isActive } = req.body;

    if (!productName && !productDescription && !price && !imageUrl && isActive === undefined) {
        res.status(400).json({ message: "At least one field is required to update" });
        return;
    }

    if (price !== undefined) {
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            res.status(400).json({ message: "Invalid price" });
            return;
        }
    }

    try {
        const existing = await db.select().from(links).where(
            and(eq(links.linkCode, linkCode), eq(links.userId, userId))
        );

        if (existing.length === 0) {
            res.status(404).json({ message: "Link not found" });
            return;
        }

        const updates: Record<string, unknown> = {};
        if (productName) updates.productName = productName;
        if (productDescription) updates.productDescription = productDescription;
        if (price !== undefined) updates.price = Math.round(parseFloat(price) * 100);
        if (imageUrl) updates.imageUrl = imageUrl;
        if (isActive !== undefined) updates.isActive = isActive;

        const updated = await db.update(links).set(updates).where(
            and(eq(links.linkCode, linkCode), eq(links.userId, userId))
        ).returning();

        res.status(200).json({ message: "Link updated successfully", link: updated[0] });
    } catch (error) {
        console.error("Failed to update link:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;

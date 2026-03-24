import express from "express";
import { nanoid } from "nanoid";
import { links } from "../db/schema/links";
import { db } from "../db";
import { AuthRequest } from "../middleware/auth";

const router =  express.Router();

router.post("/", async (req: AuthRequest, res) => {
    const { productName, productDescription, price, imageUrl } = req.body;
    const parsedPrice = parseFloat(price);
    const userId = req.userId;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        res.status(400).json({"message": "Invalid price"});
        return;
    }

    if (!productName || !price ) {
        res.status(400).json({"message": "Product name and price are required"});
        return;
    }

    if (!userId) {
        res.status(401).json({"message": "Unauthorized"});
        return;
    }

    try {
        const newLink = await db.insert(links).values({
            userId,
            linkCode: `product-${nanoid(8)}`,
            productName,
            productDescription,
            price: Math.round(parseFloat(price) * 100),
            imageUrl,
        }).returning();
        
        res.status(201).json({"message": "Link created successfully", "link": newLink[0]});
    }

    catch (error) {
        console.error("Failed to create link:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
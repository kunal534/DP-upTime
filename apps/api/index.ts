import express from "express";
import type { Request, Response } from "express";
import { authMiddleware } from "./middleware";  // assuming you have an authentication middleware
import { prismaClient } from "db/client";  // assuming Prisma client is properly set up
import cors from "cors";
import { Transaction, SystemProgram, Connection } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint to create a website
app.post("/api/v1/website", authMiddleware, async (req, res) => {
    const userId = req.userId!;
    const { url } = req.body;

    try {
        const data = await prismaClient.website.create({
            data: {
                userId,
                url,
            },
        });

        res.json({
            id: data.id,
        });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Endpoint to get website status
app.get("/api/v1/website/status", authMiddleware, async (req, res): Promise<void> => {
    const websiteId = req.query.websiteId! as string;
    const userId = req.userId!;

    try {
        const data = await prismaClient.website.findFirst({
            where: {
                id: websiteId,
                userId,
                disabled: false,
            },
            include: {
                ticks: true,  // Include tick history to show status updates
            },
        });

        if (!data) {
            res.status(404).json({ message: "Website not found" });
            return;  // Explicit return to prevent execution beyond this point
        }

        // Return the website data along with the last status
        res.json({
            ...data,
            lastStatus: data.ticks.length > 0 ? data.ticks[0] : null,
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching website status" });
    }
});

// Endpoint to get all websites
app.get("/api/v1/websites", authMiddleware, async (req, res) => {
    const userId = req.userId!;

    try {
        const websites = await prismaClient.website.findMany({
            where: {
                userId,
                disabled: false,
            },
            include: {
                ticks: true,  // Include tick history for all websites
            },
        });

        res.json({
            websites,
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching websites" });
    }
});

// Endpoint to delete a website
app.delete("/api/v1/website", authMiddleware, async (req, res) => {
    const websiteId = req.body.websiteId;
    const userId = req.userId!;

    try {
        await prismaClient.website.update({
            where: {
                id: websiteId,
                userId,
            },
            data: {
                disabled: true,
            },
        });

        res.json({
            message: "Deleted website successfully",
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting website" });
    }
});

// Report endpoint from validator
app.post("/api/v1/validator/report", async (req: Request, res: Response): Promise<void> => {
    const { url, status, code, validator } = req.body;

    try {
        // Find the website entry in DB
        const website = await prismaClient.website.findFirst({
            where: { url, disabled: false },
        });

        if (!website) {
            res.status(404).json({ message: "Website not found" });
            return;
        }

        // Find the validator based on the validator's public key (or another unique identifier)
        const validatorRecord = await prismaClient.validator.findFirst({
            where: {
                publicKey: validator,  // Assuming 'validator' is a public key or unique identifier
            },
        });

        if (!validatorRecord) {
            res.status(404).json({ message: "Validator not found" });
            return;
        }

        // Insert the tick record (WebsiteTick)
        const tick = await prismaClient.websiteTick.create({
            data: {
                websiteId: website.id,
                validatorId: validatorRecord.id,
                status: code === 200 ? "Good" : "Bad", // Assuming status 200 means "Good"
                latency: 0.0, // Add your latency calculation logic if needed
                createdAt: new Date(), // Record the current timestamp
            },
        });

        res.json({ success: true, tick });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error during report:", error.message);
            res.status(500).json({ message: "Internal server error", error: error.message });
        } else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
});



app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});

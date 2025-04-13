import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' }); // Direct response, but do not return
        return; // Return to end the function here, ensuring no further code execution
    }

    try {
        const decoded = jwt.verify(token, JWT_PUBLIC_KEY) as jwt.JwtPayload;
        if (!decoded || !decoded.sub) {
            res.status(401).json({ error: 'Unauthorized' }); // Direct response
            return; // Return to end the function here
        }

        req.userId = decoded.sub as string; // Attach userId to the request
        next(); // Proceed to the next middleware or handler
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized - Invalid or expired token' }); // Direct response
    }
}

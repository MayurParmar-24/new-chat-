import jwt from 'jsonwebtoken';

export const generateToken = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    if (res) {
        res.cookie("JWT", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Prevent XSS (Cross-Site Scripting) attacks
            sameSite: "strict", // Prevent CSRF (Cross-Site Request Forgery) attacks
            secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
        });
    }

    return token;
};

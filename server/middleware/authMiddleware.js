const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const User = require('../models/User');

const isPrisma = () => !!process.env.DATABASE_URL;

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'task_management_app_jwt_secret_key_2026_super_secure'
      );

      if (isPrisma()) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, name: true, email: true, createdAt: true },
        });

        if (!user) {
          return res.status(401).json({ message: 'User not found. Authorization denied.' });
        }

        req.user = { ...user, _id: user.id };
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found. Authorization denied.' });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid or expired token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no access token provided.' });
  }
};

module.exports = { protect };

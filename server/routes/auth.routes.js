import express from 'express';

const router = express.Router();

// Placeholder routes
router.post('/login', (req, res) => {
    res.json({ message: 'Login route working' });
});

router.post('/register', (req, res) => {
    res.json({ message: 'Register route working' });
});

export default router;

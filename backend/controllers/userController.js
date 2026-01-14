const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

userController.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        if (username === 'user' && password === 'user123') {
            const token = jwt.sign({ username: username, role: 'user' }, 'harshitvirtous', { expiresIn: '1h' });
            
            return res.status(200).json({ message: 'Login successful' , token : token , role: 'user' , data: { username } });
        }

        if (username === 'admin' && password === 'admin123') {
            const token = jwt.sign({ username: username, role: 'admin' }, 'harshitvirtous', { expiresIn: '1h' });

            return res.status(200).json({ message: 'Login successful' , token : token , role: 'admin' , data: { username } });
        }

        return res.status(401).json({ message: 'Invalid username or password' });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = userController;
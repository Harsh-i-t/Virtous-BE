const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUserByUsername } = require('../queries/userQueries');

userController.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid username or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid username or password',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      data: {
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = userController;
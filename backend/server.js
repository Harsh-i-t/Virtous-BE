const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const productController = require('./controllers/productController');
const authMiddleware = require('./utils/authMiddleware');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/api/auth/login', userController.login);

app.get('/api/products', productController.getAllProducts);
app.post('/api/products', authMiddleware, productController.createProduct);
app.put('/api/products/:id', authMiddleware, productController.updateQuantity);
app.delete('/api/products/:id', authMiddleware, productController.deleteProduct);

app.listen(3000, () => console.log('Server started on port 3000'));

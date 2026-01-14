const productController = require('../controllers/productController');
const db = require('../utils/db');


productController.getAllProducts = async (req, res) => {
    try {
        const products = db;
        return res.status(200).json({ data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


productController.updateQuantity = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        const { id } = req.params;
        const { quantity } = req.body;
        console.log(quantity, id);
        const products = db;
        const product = products.find(p => p.id.toString() === id.toString());
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.quantity = quantity;
        if (quantity === 0) {
            product.status = 'out-of-stock';
        } else if (quantity < 10) {
            product.status = 'low-stock';
        }

        return res.status(200).json({ message: 'Product quantity updated successfully', data: { product } });
    } catch (error) {
        console.error('Error updating product quantity:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



productController.createProduct = async (req, res) => {
    try {
        if (!req.body.name || !req.body.category || !req.body.price || !req.body.quantity) {
            return res.status(400).json({ message: 'Name, category, price, and quantity are required' });
        }
        const {name, category, price, quantity} = req.body;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        const products = db;
        const product = products.find(p => p.name.toString() === name);
        if (product) {
            return res.status(404).json({ message: 'Product already exists' });
        }
        let status = 'in stock';
        if (quantity < 0 || price < 0) {
            return res.status(400).json({ message: 'Price and quantity must be non-negative' });
        }
        else if (quantity === 0) {
            status = 'out-of-stock';
        }
        else if (quantity < 10) {
            status = 'low-stock';
        }
        const newProduct = {
            id: products.length + 1,
            name: name,
            category: category,
            price: price,
            quantity: quantity  ,
            status : status 
        };
        products.push(newProduct);
        return res.status(201).json({ message: 'Product created successfully', data: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }  
};

productController.deleteProduct = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        const { id } = req.params;
        const products = db;
        const productIndex = products.findIndex(p => p.id.toString() === id);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }
        products.splice(productIndex, 1);
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = productController;
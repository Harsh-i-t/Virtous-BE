const productController = require('../controllers/productController');
const db = require('../utils/db');
const { validateProduct } = require('../models/productModel');
const { getProductByName, createProduct, updateProductQuantity, deleteProductById, getAllProductsPaginated } = require('../queries/productQueries');

productController.getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: 'Page and limit must be positive integers',
      });
    }

    const { products, total } = await getAllProductsPaginated({
      page,
      limit,
    });

    return res.status(200).json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
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

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        message: 'Quantity must be a non-negative number',
      });
    }

    const updatedProduct = await updateProductQuantity(id, quantity);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product quantity updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product quantity:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



productController.createProduct = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        const { name, category, price, quantity } = req.body;

        try {
            validateProduct({ name, category, price, quantity });
            } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        const existingProduct = await getProductByName(name);
        if (existingProduct) {
            return res.status(409).json({ message: 'Product already exists' });
        }

        const product = await createProduct({
        name,
        category,
        price,
        quantity,
        });
        return res.status(201).json({ message: 'Product created successfully', data: product });
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

    const deletedCount = await deleteProductById(id);

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = productController;
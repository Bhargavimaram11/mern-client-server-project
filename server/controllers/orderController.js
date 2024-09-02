const Order = require('../models/Order');
const Product = require('../models/Product');
const Signup = require('../models/Signup');

// Create a new order
const createOrder = async (req, res) => {
    const { productId, userId, quantity } = req.body;

    if (!productId || !userId || !quantity) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if the product and user exist
        const product = await Product.findById(productId);
        const user = await Signup.findById(userId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create the order
        const newOrder = new Order({
            productId,
            userId,
            quantity
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error while creating order', error });
    }
};

// Get all orders with product and user details (join operation)
const getOrdersWithDetails = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('productId', 'name price') // Populate product details
            .populate('userId', 'firstName lastName email') // Populate user details
            .exec();

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders with details', error });
    }
};

// Export the functions
module.exports = {
    createOrder,
    getOrdersWithDetails
};

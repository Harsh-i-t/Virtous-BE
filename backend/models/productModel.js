const productSchema = (
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        status: { type: String, enum: ['in stock', 'out of stock',  'low-stock'], default: 'in stock' },
        createdAt: { type: Date, default: Date.now },
    }
)
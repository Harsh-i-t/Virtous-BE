const PRODUCT_STATUS = ['in stock', 'out of stock', 'low-stock'];

const validateProduct = ({ name, category, price, quantity }) => {
  if (!name) throw new Error('Product name required');
  if (!category) throw new Error('Category required');
  if (price < 0) throw new Error('Invalid price');
  if (quantity < 0) throw new Error('Invalid quantity');
};

module.exports = {
  PRODUCT_STATUS,
  validateProduct,
};


// CREATE TYPE product_status AS ENUM (
//   'in stock',
//   'out of stock',
//   'low-stock'
// );

// CREATE TABLE products (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   name VARCHAR(150) NOT NULL UNIQUE,
//   category VARCHAR(100) NOT NULL,
//   price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
//   quantity INTEGER NOT NULL CHECK (quantity >= 0),
//   status product_status NOT NULL DEFAULT 'in stock',
//   created_at TIMESTAMPTZ DEFAULT now()
// );

// CREATE OR REPLACE FUNCTION sync_product_status()
// RETURNS TRIGGER AS $$
// BEGIN
//   IF NEW.quantity = 0 THEN
//     NEW.status := 'out of stock';
//   ELSIF NEW.quantity < 10 THEN
//     NEW.status := 'low-stock';
//   ELSE
//     NEW.status := 'in stock';
//   END IF;

//   RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;


// CREATE TRIGGER trg_sync_product_status
// BEFORE INSERT OR UPDATE ON products
// FOR EACH ROW
// EXECUTE FUNCTION sync_product_status();
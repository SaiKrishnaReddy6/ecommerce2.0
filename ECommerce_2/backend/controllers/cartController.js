const { Cart, CartItem } = require('../models/cart');
const {Inventory} = require('../models/inventory');

// Controller function to add an item to the cart
exports.addToCart = async (req, res) => {
  const { inventory_item_id, customer_id, quantity } = req.body;

  try {
    // Find the cart for the given customer
    const cart = await Cart.findOne({ where: { customer_id } });

    // If cart doesn't exist, create a new one
    if (!cart) {
      const newCart = await Cart.create({ customer_id });
      const cart_id = newCart.cart_id;

      // Create a new cart item and add to the cart
      const inventory = await Inventory.findOne({ where: { inventory_item_id } });
      const temp_price = inventory.price;
      const price = quantity * temp_price;

      await CartItem.create({
        inventory_item_id,
        cart_id,
        quantity,
        price,
      });

      return res.status(200).json({ message: 'Item added to cart successfully.' });
    }

    const cart_id = cart.cart_id;

    // Check if the cart already has the item
    const existingCartItem = await CartItem.findOne({
      where: { cart_id, inventory_item_id },
    });
    console.log('Hiii')
    if (existingCartItem) {
      // Update the quantity and price of the existing item in the cart
      const inventory = await Inventory.findOne({ where: { inventory_item_id } });
      const temp_price = inventory.price;
      const price = quantity * temp_price;
      console.log("Here ", quantity)
      if(existingCartItem.quantity>=quantity){
        existingCartItem.quantity = quantity;
        existingCartItem.price = price;
        await existingCartItem.save();
      }
      else{
        return res.status(500).json({message:"Stock of this product left is less than required quantity"});
      }
      existingCartItem.quantity = quantity;
      existingCartItem.price = price;

      await existingCartItem.save();
    } else {
      // Create a new cart item and add to the cart
      //console.log("There ",quantity,Inventory.quantity)
      const inventory = await Inventory.findOne({ where: { inventory_item_id } });
      
      if(inventory.quantity>=quantity){
      const temp_price = inventory.price;
      const price = quantity * temp_price;

      await CartItem.create({
        inventory_item_id,
        cart_id,
        quantity,
        price,
      });
      
    }
    else{
      return res.status(500).json({ message: "Stock of this product left is less than required quantity" });
    }
    }

    return res.status(200).json({ message: 'Item added to cart successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Controller function to update the quantity of an item in the cart
exports.updateCartItemQuantity = async (req, res) => {
  const { inventory_item_id, customer_id, quantity } = req.body;
  
  try {
    const cart = await Cart.findOne({ where: { customer_id } });
    const cart_id = cart.cart_id;
    // Check if the cart already has the item
    const existingCartItem = await CartItem.findOne({
        where: { cart_id, inventory_item_id },
    });
    
    if (!existingCartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    const inventory = await Inventory.findOne({ where: { inventory_item_id } });
    const temp_price = inventory.price;
    const price = quantity * temp_price;
  
    existingCartItem.quantity = quantity;
    existingCartItem.price = price;
  
    await existingCartItem.save();

    return res.status(200).json({ message: 'Cart item updated successfully.' });
  } catch (error) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Controller function to delete an item from the cart
exports.deleteCartItem = async (req, res) => {
    const { inventory_item_id, customer_id } = req.body;
    try {
        const cart = await Cart.findOne({ where: { customer_id } });
        const cart_id = cart.cart_id;
        // Check if the cart already has the item
        const existingCartItem = await CartItem.findOne({
            where: { cart_id, inventory_item_id },
        });
        const cart_item_id = existingCartItem.cart_item_id;
      // Find item in cart
      const item = await CartItem.findByPk(cart_item_id);
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      // Delete item from cart
      await item.destroy();
  
      res.status(200).json({ message: 'Item deleted from cart' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

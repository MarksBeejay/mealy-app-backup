const express = require('express');
const { validateItemCreation, validateItemFilter, validateItemCategory, 
  validateItemDetails, validateItemCustomization } = require('../validators/validationMiddleware');
const router = express.Router();
const {Item} = require('../models/item');


// Route to create a new item
router.post('/create', validateItemCreation, async (req, res) => {
  try {
    const { name, restaurant, description, mainIngredients, category, price, } = req.body;

    // Create a new item instance
    const newItem = new Item({
      name,
      restaurant,
      description,
      mainIngredients,
      category,
      price,
    });

    // Save the item to the database
    await newItem.save();

    res.status(201).json({
      status: true,
      message: 'Item created successfully',
      data: newItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create item'  });
  }
});



//Route to get all items
router.get('/all', async (req, res) => {
  try{
    const items = await Item.find()//.select('name price category dietaryPreferences');

    if (items.length === 0) {
      return res.json({ message: 'Sorry, no items were found' });
    }
    res.json(items);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to get items' });
    }
});


// Route to handle item filtering
router.get('/filter', validateItemFilter, async (req, res) => {
  try {
    let { name, restaurant, description, mainIngredients, category, price } = req.query;

     // Convert query parameters to lowercase
     name = name ? name.toLowerCase() : null;
     restaurant = restaurant ? restaurant.toLowerCase() : null;
     description = description ? description.toLowerCase() : null;
     category = category ? category.toLowerCase() : null;
     price = price ? price.toLowerCase() : null;
     mainIngredients = mainIngredients ? mainIngredients.toLowerCase() : null;

    let filters = {};

    if (name) {
      filters.name = name.toLowerCase();
    }
    if (restaurant) {
      filters.restaurant = restaurant.toLowerCase();
    }
    if (description) {
      filters.description = description.toLowerCase();
    }
    if (category) {
      filters.category = category.toLowerCase();
    }

    if (price) {
      const [minPrice, maxPrice] = price.split('-');
    
      if (minPrice && maxPrice) {
        filters.price = {
          $gte: parseFloat(minPrice),
          $lte: parseFloat(maxPrice),
        };
      } else if (minPrice) {
        filters.price = parseFloat(minPrice);
      }
    }

    if (mainIngredients) {
      let lowercasemainIngredients = mainIngredients.split(',').map(ingredients => ingredients.toLowerCase());
      filters.mainIngredients = { $in: lowercasemainIngredients };
    }

    const filteredItems = await Item.find(filters);

    if (filteredItems.length === 0) {
      return res.json({ message: 'Sorry, no items were found' });
    }

    console.log(filteredItems)

    res.json(filteredItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to filter items' });
  }
});


// Define the route for item categorization
router.put('/categorization/:itemId', validateItemCategory, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { category } = req.body;

    // Find the item by its ID
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Assign the category to the item
    item.category = category;

    // Save the updated item in the database
    await item.save();

    // Return the updated item
    res.status(200).json({
      status: true,
            message: 'Item category updated successfully',
            data: item,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: 'Failed to categorize item' });
  }
});


// Route to get all available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Item.distinct('category');

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});


// Define the route for item details
router.get('/details/:itemId', validateItemDetails, async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find the item by its ID
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Return the item details
    res.json(item);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: 'Failed to fetch item details' });
  }
});



// Define the route for item customization by restaurant
router.put('/:itemId/customize', validateItemCustomization, async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find the item by its ID
    let item = await Item.findByIdAndUpdate(itemId, {...req.body}, {new: true});

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Save the updated item in the database
    const updatedItem = await item.save();

    // Return the updated item
    res.status(200).json({
      status: true,
      message: 'Item details updated successfully new',
      data: updatedItem,
    });

  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: 'Failed to update item details' });
  }
});



// POST route for item customization by user
router.post('/customize/:id', async (req, res) => {
  try {
    const itemId = req.params.id; // Corrected the parameter name to 'id'
    const customization = req.body.customization;

    // Update the item's customization attribute
    await Item.findByIdAndUpdate(itemId, { customization });

    // Find the updated item
    const updatedItem = await Item.findById(itemId);

    // Save the updated item in the database
    await updatedItem.save(); // Call save on the instance of Item

    res.status(200).json({
      message: 'Item customization updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating item customization:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






module.exports = router;
const express = require('express');
const { validateItemCreation, validateItemFilter, validateItemCategory } = require('../validators/validationMiddleware');
const router = express.Router();
const {Item} = require('../models/item');


// Route to create a new item
router.post('/create', validateItemCreation, async (req, res) => {
  try {
    const { name, category, price, dietaryPreferences } = req.body;

    // Create a new item instance
    const newItem = new Item({
      name,
      category,
      price,
      dietaryPreferences,
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
    let { category, price, dietaryPreferences } = req.query;

     // Convert query parameters to lowercase
     category = category ? category.toLowerCase() : null;
     dietaryPreferences = dietaryPreferences ? dietaryPreferences.toLowerCase() : null;

    let filters = {};

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

    if (dietaryPreferences) {
      let lowercaseDietaryPreferences = dietaryPreferences.split(',').map(preference => preference.toLowerCase());
      filters.dietaryPreferences = { $in: lowercaseDietaryPreferences };
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

module.exports = router;
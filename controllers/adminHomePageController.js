const Admin = require('../models/adminHomePagemodel');
const multer = require('multer');
// Create item
const createItem = async (req, res) => {
    try {
        // Extract item details from the request body
        const { Item_Name, Brand_Name, Category, MRP,Image,Stock, Shop } = req.body;
    
        // Create a new item object using the Admin model
        const newItem = new Admin({
          Item_Name,
          Brand_Name,
          Category,
          MRP,
          Image,
          Stock,
          Shop
        });
        const storage = multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, 'uploads/'); // Specify the destination directory where uploaded files will be stored
          },
          filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname); // Specify the file name
          }
        });
        if (req.file) {
          // Save the filename to the database
          newItem.Image = req.file.filename;
        }
        // Initialize Multer upload
        const upload = multer({ storage: storage });
        // Save the new item to the database
        const savedItem = await newItem.save();
    
        // Respond with the saved item
        res.status(201).json(savedItem);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    
  };

// Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.json(updatedItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Admin.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
//////get all item
const getAllItems = async (req, res) => {
  try {
    const allItems = await Admin.find();
    res.json(allItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  getAllItems
};



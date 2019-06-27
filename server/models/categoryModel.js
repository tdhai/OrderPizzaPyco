const mongoose = require('mongoose');
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: { type: String, required: true },
  productID: [{ type: Schema.Types.ObjectId, ref: "product", required: true }]
})
const createCategoy = async (name, id) => {
  try {
    var category = new Category();
    category.name = name;
    category.productID = id
    return await category.save();
  } catch (error) {
    throw ("create category fail MODEL", error)
  }
}

const getCategory = async (categoryID) => {
  try {
    return await Category.findOne({ '_id': categoryID }).populate('productID')
  } catch (error) {
    throw ("get category fail MODEL", error)
  }
}

const getAllCategory = async () => {
  try {
    return await Category.find().populate('productID')
  } catch (error) {
    throw ("get all category fail MODEL", error)
  }
}

const Category = mongoose.model('category', categorySchema)

module.exports = {
  Category,
  createCategoy,
  getAllCategory,
  getCategory
}
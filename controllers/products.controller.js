const Product = require('../models/product.module');

exports.getAll = async (req, res) => {
  try {
    res.json(await Product.find());
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const pro = await Product.find().skip(rand);
    if (!pro) res.status(404).json({ message: 'Not found' });
    else res.json(pro);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getId = async (req, res) => {
  try {
    const pro = await Product.findById(req.params.id);
    if (!pro) res.status(404).json({ message: 'Not found' });
    else res.json(pro);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postNew = async (req, res) => {
  try {
    const { name, client } = req.body;
    const newProduct = new Product({ name: name, client: client });
    await newProduct.save();
    res.json({ message: 'OK' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.putUpdate = async (req, res) => {
  const { client } = req.body;
  
  try {
    let pro = await(Product.findById(req.params.id));
    if(pro) {
      await Product.updateOne({ _id: req.params.id }, { $set: { client: client } });
      pro = await (Product.findById(req.params.id));
      res.json(pro);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.deleteId = async (req, res) => {
  try {
    const pro = await (Product.findById(req.params.id));
    if (pro) {
      await Product.deleteOne({ _id: req.params.id });
      res.json(pro);
    }
    else res.status(404).json({ message: 'ok' });
  }
  catch (err) {
    res.status(500).json({ message: 'ok' });
  }
};
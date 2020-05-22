// post.routes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/product.module');

router.get('/products', async (req, res) => {
  try {
    res.json(await Product.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/products/random', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const pro = await Product.findOne().skip(rand);
    if(!pro) res.status(404).json({ message: 'Not found' });
    else res.json(pro);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const pro = await Product.findById(req.params.id);
    if(!pro) res.status(404).json({ message: 'Not found' });
    else res.json(pro);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, client } = req.body;
    const newProduct = new Product({ name: name, client: client });
    await newProduct.save();
    res.json({ message: 'OK' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/products/:id', async (req, res) => {
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
});

router.delete('/products/:id', async (req, res) => {
  try {
    const pro = await (Product.findById(req.params.id));
    if (pro) {
      await Product.deleteOne({_id: req.params.id});
      res.json(pro);
    }
    else res.status(404).json({ message: 'ok' });
  }
  catch (err) {
    res.status(500).json({ message: 'ok' });
  }
});

module.exports = router;

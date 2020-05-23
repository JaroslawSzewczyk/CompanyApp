const Employee = require('../models/employee.module');

exports.getAll = async (req, res) => {
  
  try {
    res.json(await Employee.find().populate('department'));
  }
  catch (err) {
    res.status(500).json({ message: err });
  };
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const emp = await Employee.findOne().skip(rand);
    if (!emp) res.status(404).json({ message: 'not found' });
    else res.json(emp);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getId = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postNew = async (req, res) => {
  try {

    const { firstName, lastName, department } = req.body;
    const newEmployee = new Employee({ firstName: firstName, lastName: lastName, department: department });
    await newEmployee.save();
    res.json({ message: 'OK' });

  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.putUpdate = async (req, res) => {
  const { department } = req.body;
  
  try {
    let emp = await (Employee.findById(req.params.id));
    if (emp) {
      await Employee.updateOne({ _id: req.params.id }, { $set: { department: department } });
      emp = await (Employee.findById(req.params.id));
      res.json(emp);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteId = async (req, res) => {
  try {
    const emp = await (Employee.findById(req.params.id));
    if (emp) {
      await Employee.deleteOne({ _id: req.params.id });
      res.json(emp);
    }
    else res.status(404).json({ message: 'ok' });
  }
  catch (err) {
    res.status(500).json({ message: 'ok' });
  }
};
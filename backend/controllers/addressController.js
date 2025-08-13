const Address = require('../models/Address');

exports.getAddresses = async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.json(addresses);
};

exports.addAddress = async (req, res) => {
  const address = await Address.create({ ...req.body, user: req.user._id });
  res.status(201).json(address);
};

exports.deleteAddress = async (req, res) => {
  await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Address deleted' });
}; 
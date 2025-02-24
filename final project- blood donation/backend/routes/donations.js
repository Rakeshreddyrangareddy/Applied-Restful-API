const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: String,
  bloodType: String,
  contact: String,
  date: Date
});

const Donation = mongoose.model('Donation', donationSchema);

router.get('/', async (req, res) => {
  const donations = await Donation.find();
  res.json(donations);
});

router.post('/', async (req, res) => {
  const donation = new Donation(req.body);
  await donation.save();
  res.json(donation);
});

router.put('/:id', async (req, res) => {
  const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(donation);
});

router.patch('/:id', async (req, res) => {
  const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(donation);
});

router.delete('/:id', async (req, res) => {
  await Donation.findByIdAndDelete(req.params.id);
  res.json({ message: 'Donation deleted' });
});

module.exports = router;
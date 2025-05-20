const mongoose = require('mongoose');

const CharacterCreatedSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  characterNumber: { type: String, required: true },
  firstName: String,
  lastName: String,
  gender: String,
  birthday: String,
  placeBirth: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CharactersCreated', CharacterCreatedSchema);

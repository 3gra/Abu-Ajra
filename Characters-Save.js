const mongoose = require('mongoose');

const CharacterSaveSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  selectedCharacter: { type: String, required: true }
});

module.exports = mongoose.model('CharactersSave', CharacterSaveSchema);

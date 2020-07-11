const mongoose = require('mongoose');
const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID : String,
  guildName : String,
  members : [{
    memberID : String,
    memberName : String,
    memberLevel : Number,
  }],
});

module.exports = mongoose.model('Guild', guildSchema);

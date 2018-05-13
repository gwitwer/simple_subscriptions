import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  email: { type: 'String', required: true, uniue: true },
  pass: { type: 'String', required: true },
  type: { type: 'String', default: 'player', required: true }, // shop, admin, coach, player
  cuid: { type: 'String', required: true },
  dateCreated: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Shop', shopSchema);

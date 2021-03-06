import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const shopSchema = new Schema({
	access_token: { type: String },
	charge_id: { type: Number },
	dateCreated: { type: Number },
	email: { type: String },
	installing: { type: Boolean, default: false },
	name: { type: String, required: true, unique: true },
});

export default mongoose.model('Shop', shopSchema);

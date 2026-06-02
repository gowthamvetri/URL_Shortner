import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    browser: {
      type: String,
    },
    device: {
      type: String,
    },
    operatingSystem: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    referrer: {
      type: String,
    },
  },
  {
    timestamps: false, // We use a custom timestamp field
  }
);

export default mongoose.model('Visit', visitSchema);

const mongoose = require('mongoose');

const PathSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    from: {
      type: String,
      required: true,
      ref: 'Location'
    },
    to: {
      type: String,
      required: true,
      ref: 'Location'
    },
    distance: {
      type: Number,
      required: true,
      min: 0
    },
    accessible: {
      type: Boolean,
      default: true
    },
    hasStairs: {
      type: Boolean,
      default: false
    },
    surface: {
      type: String,
      enum: ['paved', 'gravel', 'ramped', 'stairs', 'tile', 'asphalt', 'other'],
      default: 'paved'
    },
    name: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    pathCoordinates: {
      type: [[Number]], // Array of [lat, lng]
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Path', PathSchema);

const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    shortName: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['academic', 'administrative', 'amenity', 'residential', 'entry', 'sports', 'health', 'junction']
    },
    code: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    coordinates: {
      type: [Number], // [lat, lng]
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 2;
        },
        message: 'Coordinates must be [latitude, longitude]'
      }
    },
    isJunction: {
      type: Boolean,
      default: false
    },
    accessible: {
      type: Boolean,
      default: true
    },
    openingHours: {
      type: String
    },
    features: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Location', LocationSchema);

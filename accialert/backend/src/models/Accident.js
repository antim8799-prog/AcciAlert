import mongoose from 'mongoose';

const accidentSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: [true, 'Report ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    accidentType: {
      type: String,
      required: [true, 'Accident type is required'],
      trim: true,
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      trim: true,
      lowercase: true,
      enum: {
        values: ['low', 'moderate', 'critical'],
        message: 'Severity must be either low, moderate, or critical',
      },
    },
    injuredPeople: {
      type: Number,
      default: 0,
      min: [0, 'Injured people count cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be >= -90'],
        max: [90, 'Latitude must be <= 90'],
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be >= -180'],
        max: [180, 'Longitude must be <= 180'],
      },
    },
    photo: {
      type: String,
      default: null,
    },
    reporter: {
      name: {
        type: String,
        default: '',
        trim: true,
        maxlength: 120,
      },
      phone: {
        type: String,
        default: '',
        trim: true,
        maxlength: 30,
      },
    },
    status: {
      type: String,
      default: 'reported',
      trim: true,
      lowercase: true,
      enum: {
        values: [
          'reported',
          'under_review',
          'verified',
          'responder_assigned',
          'responding',
          'resolved',
          'disputed',
        ],
        message:
          'Status must be one of: reported, under_review, verified, responder_assigned, responding, resolved, disputed',
      },
    },
    confirmations: {
      type: Number,
      default: 0,
      min: [0, 'Confirmations cannot be negative'],
    },
    disputes: {
      type: Number,
      default: 0,
      min: [0, 'Disputes cannot be negative'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Exclude internal Mongoose __v
    versionKey: false,
  }
);

// If model is already compiled (e.g. during dev hot-reloads) use existing
export const Accident = mongoose.models.Accident || mongoose.model('Accident', accidentSchema);

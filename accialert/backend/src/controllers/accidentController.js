import mongoose from 'mongoose';
import { Accident } from '../models/Accident.js';

// In-memory fallback repository when MongoDB connection is not yet configured or offline
const memoryAccidentStore = [];

function generateReportId() {
  const chars = '0123456789ABCDEF';
  let hex = '';
  for (let i = 0; i < 6; i++) {
    hex += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ACC-${hex}`;
}

export const createAccident = async (req, res, next) => {
  try {
    const {
      accidentType,
      severity,
      injuredPeople,
      description,
      location,
      photo,
      reporter,
    } = req.body;

    // 1. Validation
    const validationErrors = [];

    if (!accidentType || typeof accidentType !== 'string' || !accidentType.trim()) {
      validationErrors.push('accidentType is required and must be a non-empty string.');
    }

    if (!severity || typeof severity !== 'string') {
      validationErrors.push('severity is required.');
    } else {
      const normalizedSeverity = severity.trim().toLowerCase();
      if (!['low', 'moderate', 'critical'].includes(normalizedSeverity)) {
        validationErrors.push("severity must be one of: 'low', 'moderate', 'critical'.");
      }
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      validationErrors.push('description is required and must describe the incident.');
    }

    if (!location || typeof location !== 'object') {
      validationErrors.push('location object with latitude and longitude is required.');
    } else {
      const lat = Number(location.latitude);
      const lng = Number(location.longitude);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        validationErrors.push('location.latitude must be a valid number between -90 and 90.');
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        validationErrors.push('location.longitude must be a valid number between -180 and 180.');
      }
    }

    if (typeof description === 'string' && description.trim().length > 2000) {
      validationErrors.push('description must be 2000 characters or fewer.');
    }

    const parsedInjured = injuredPeople !== undefined ? Number(injuredPeople) : 0;
    if (isNaN(parsedInjured) || parsedInjured < 0 || parsedInjured > 500) {
      validationErrors.push('injuredPeople must be a whole number between 0 and 500.');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // 2. Format sanitized data
    const normalizedSeverity = severity.trim().toLowerCase();
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);

    let reportId = generateReportId();

    // Ensure unique ID
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      attempts++;
      if (mongoose.connection.readyState === 1) {
        const existing = await Accident.findOne({ reportId });
        if (!existing) isUnique = true;
        else reportId = generateReportId();
      } else {
        const existing = memoryAccidentStore.find((a) => a.reportId === reportId);
        if (!existing) isUnique = true;
        else reportId = generateReportId();
      }
    }

    const accidentData = {
      reportId,
      accidentType: accidentType.trim(),
      severity: normalizedSeverity,
      injuredPeople: Math.floor(parsedInjured),
      description: description.trim(),
      location: {
        latitude: lat,
        longitude: lng,
      },
      // Note: Do not store large binary image data in MongoDB
      photo: typeof photo === 'string' && photo.startsWith('http') ? photo : null,
      reporter: {
        name: (reporter?.name || '').trim(),
        phone: (reporter?.phone || '').trim(),
      },
      status: 'reported',
      confirmations: 0,
      disputes: 0,
      createdAt: new Date(),
    };

    // 3. Persist to MongoDB or Fallback Store
    if (mongoose.connection.readyState === 1) {
      const doc = new Accident(accidentData);
      await doc.save();
    } else {
      memoryAccidentStore.unshift(accidentData);
    }

    // 4. Return successful response
    return res.status(201).json({
      success: true,
      message: 'Accident report created successfully',
      data: {
        reportId: accidentData.reportId,
        status: accidentData.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const ALLOWED_STATUS_TRANSITIONS = {
  reported: ['under_review'],
  under_review: ['verified', 'disputed'],
  verified: ['responder_assigned'],
  responder_assigned: ['responding'],
  responding: ['resolved'],
  resolved: [],
  disputed: [],
};

export const getAccidentById = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    if (!reportId || !reportId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'reportId parameter is required',
      });
    }

    const cleanReportId = reportId.trim().toUpperCase();
    let report = null;

    if (mongoose.connection.readyState === 1) {
      report = await Accident.findOne({ reportId: cleanReportId })
        .select('-_id -reporter.phone')
        .lean();
    } else {
      const raw = memoryAccidentStore.find((a) => a.reportId.toUpperCase() === cleanReportId) || null;
      if (raw) {
        const { reporter, ...rest } = raw;
        report = {
          ...rest,
          confirmations: rest.confirmations || 0,
          disputes: rest.disputes || 0,
          reporter: { name: reporter?.name || '' },
        };
      }
    }

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Accident report not found',
      });
    }

    // Guarantee default numerical values
    if (report.confirmations === undefined) report.confirmations = 0;
    if (report.disputes === undefined) report.disputes = 0;

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentAccidents = async (req, res, next) => {
  try {
    let reports = [];

    if (mongoose.connection.readyState === 1) {
      // Exclude reporter.phone for privacy in list view, limit 50
      reports = await Accident.find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .select('-_id -reporter.phone')
        .lean();
    } else {
      // In-memory fallback
      reports = memoryAccidentStore
        .slice(0, 50)
        .map(({ reporter, ...rest }) => ({
          ...rest,
          confirmations: rest.confirmations || 0,
          disputes: rest.disputes || 0,
          reporter: { name: reporter?.name || '' },
        }));
    }

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccidentStatus = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (!reportId || !reportId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'reportId parameter is required',
      });
    }

    if (!status || typeof status !== 'string' || !status.trim()) {
      return res.status(400).json({
        success: false,
        message: 'status field is required in request body',
      });
    }

    const cleanReportId = reportId.trim().toUpperCase();
    const targetStatus = status.trim().toLowerCase();
    const validStatuses = Object.keys(ALLOWED_STATUS_TRANSITIONS);

    if (!validStatuses.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Fetch existing incident
    let currentDoc = null;
    if (mongoose.connection.readyState === 1) {
      currentDoc = await Accident.findOne({ reportId: cleanReportId });
    } else {
      currentDoc = memoryAccidentStore.find((a) => a.reportId.toUpperCase() === cleanReportId);
    }

    if (!currentDoc) {
      return res.status(404).json({
        success: false,
        message: 'Accident report not found',
      });
    }

    const currentStatus = currentDoc.status || 'reported';
    const allowedNextStatuses = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedNextStatuses.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions from '${currentStatus}': [${allowedNextStatuses.join(', ') || 'none'}]`,
      });
    }

    // Perform update
    if (mongoose.connection.readyState === 1) {
      currentDoc.status = targetStatus;
      await currentDoc.save();
    } else {
      currentDoc.status = targetStatus;
    }

    return res.status(200).json({
      success: true,
      message: 'Incident status updated',
      data: {
        reportId: cleanReportId,
        status: targetStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const confirmAccident = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    if (!reportId || !reportId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'reportId parameter is required',
      });
    }

    const cleanReportId = reportId.trim().toUpperCase();
    let updatedDoc = null;

    if (mongoose.connection.readyState === 1) {
      updatedDoc = await Accident.findOneAndUpdate(
        { reportId: cleanReportId },
        { $inc: { confirmations: 1 } },
        { new: true }
      );
    } else {
      const existing = memoryAccidentStore.find((a) => a.reportId.toUpperCase() === cleanReportId);
      if (existing) {
        existing.confirmations = (existing.confirmations || 0) + 1;
        updatedDoc = existing;
      }
    }

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: 'Accident report not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Community confirmation recorded',
      data: {
        reportId: cleanReportId,
        confirmations: updatedDoc.confirmations,
        disputes: updatedDoc.disputes || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const disputeAccident = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    if (!reportId || !reportId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'reportId parameter is required',
      });
    }

    const cleanReportId = reportId.trim().toUpperCase();
    let updatedDoc = null;

    if (mongoose.connection.readyState === 1) {
      updatedDoc = await Accident.findOneAndUpdate(
        { reportId: cleanReportId },
        { $inc: { disputes: 1 } },
        { new: true }
      );
    } else {
      const existing = memoryAccidentStore.find((a) => a.reportId.toUpperCase() === cleanReportId);
      if (existing) {
        existing.disputes = (existing.disputes || 0) + 1;
        updatedDoc = existing;
      }
    }

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: 'Accident report not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Community dispute signal recorded',
      data: {
        reportId: cleanReportId,
        confirmations: updatedDoc.confirmations || 0,
        disputes: updatedDoc.disputes,
      },
    });
  } catch (error) {
    next(error);
  }
};

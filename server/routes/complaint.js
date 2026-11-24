// server/routes/complaint.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload');
const isStaff = require('../middleware/isStaff');
const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    assignComplaint,
    updateComplaintStatus,
    getAssignedComplaints,
    staffUpdateComplaint,
    getComplaintStats
} = require('../controllers/complaintController');

// Statistics route must come before parameterized routes
router.get('/stats', authMiddleware, isAdmin, getComplaintStats);

// User routes
router.post('/', authMiddleware, upload.singleImage('image'), createComplaint);
router.get('/my', authMiddleware, getMyComplaints);

// Staff routes
router.get('/assigned', authMiddleware, isStaff, getAssignedComplaints);
router.post('/:id/staff-update', authMiddleware, isStaff, upload.singleImage('photo'), staffUpdateComplaint);

// Admin routes (moved to end to avoid conflicts)
router.put('/:id/assign', authMiddleware, isAdmin, assignComplaint);
router.put('/:id/status', authMiddleware, isAdmin, updateComplaintStatus);
router.get('/', authMiddleware, isAdmin, getAllComplaints);

// Generic get by id route should be last
router.get('/:id', authMiddleware, getComplaintById);

module.exports = router;


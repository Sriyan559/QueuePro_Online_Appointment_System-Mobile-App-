const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    getCenterAppointments,
    updateAppointment,
    cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, serviceProvider } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, bookAppointment);

router.get('/my-appointments', protect, getMyAppointments);
router.get('/center/:centerId', protect, serviceProvider, getCenterAppointments);

router.route('/:id')
    .put(protect, updateAppointment)
    .delete(protect, cancelAppointment);

module.exports = router;

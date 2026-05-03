const Appointment = require('../models/Appointment');
const ServiceCenter = require('../models/ServiceCenter');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private
const bookAppointment = async (req, res) => {
    const { centerId, date, timeSlot } = req.body;

    const appointment = new Appointment({
        centerId,
        customerId: req.user._id,
        date,
        timeSlot,
    });

    const createdAppointment = await appointment.save();
    res.status(213).json(createdAppointment);
};

// @desc    Get user's appointments
// @route   GET /api/appointments/my-appointments
// @access  Private
const getMyAppointments = async (req, res) => {
    const appointments = await Appointment.find({ customerId: req.user._id }).populate('centerId');
    res.json(appointments);
};

// @desc    Get appointments for a service center (for providers)
// @route   GET /api/appointments/center/:centerId
// @access  Private/ServiceProvider
const getCenterAppointments = async (req, res) => {
    const center = await ServiceCenter.findById(req.params.centerId);

    if (center) {
        if (center.providerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const appointments = await Appointment.find({ centerId: req.params.centerId }).populate('customerId', 'name phone');
        res.json(appointments);
    } else {
        res.status(404).json({ message: 'Center not found' });
    }
};

// @desc    Update appointment status/schedule
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
    const { status, date, timeSlot } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        // If not admin/provider, check if it's the customer's own appointment
        if (appointment.customerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin' && req.user.role !== 'ServiceProvider') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        appointment.status = status || appointment.status;
        appointment.date = date || appointment.date;
        appointment.timeSlot = timeSlot || appointment.timeSlot;

        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const cancelAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        if (appointment.customerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        appointment.status = 'Cancelled';
        await appointment.save();
        res.json({ message: 'Appointment cancelled' });
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    getCenterAppointments,
    updateAppointment,
    cancelAppointment,
};

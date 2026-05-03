const ServiceCenter = require('../models/ServiceCenter');

// @desc    Create a new service center
// @route   POST /api/centers
// @access  Private/ServiceProvider
const createCenter = async (req, res) => {
    const { name, location, contact, type, packageType } = req.body;

    const center = new ServiceCenter({
        providerId: req.user._id,
        name,
        location,
        contact,
        type,
        packageType,
    });

    const createdCenter = await center.save();
    res.status(201).json(createdCenter);
};

// @desc    Get all service centers
// @route   GET /api/centers
// @access  Public
const getCenters = async (req, res) => {
    const centers = await ServiceCenter.find({});
    res.json(centers);
};

// @desc    Get service center by ID
// @route   GET /api/centers/:id
// @access  Public
const getCenterById = async (req, res) => {
    const center = await ServiceCenter.findById(req.params.id);

    if (center) {
        res.json(center);
    } else {
        res.status(404).json({ message: 'Center not found' });
    }
};

// @desc    Update a service center
// @route   PUT /api/centers/:id
// @access  Private/ServiceProvider
const updateCenter = async (req, res) => {
    const { name, location, contact, type } = req.body;

    const center = await ServiceCenter.findById(req.params.id);

    if (center) {
        if (center.providerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        center.name = name || center.name;
        center.location = location || center.location;
        center.contact = contact || center.contact;
        center.type = type || center.type;

        const updatedCenter = await center.save();
        res.json(updatedCenter);
    } else {
        res.status(404).json({ message: 'Center not found' });
    }
};

// @desc    Delete a service center
// @route   DELETE /api/centers/:id
// @access  Private/ServiceProvider
const deleteCenter = async (req, res) => {
    const center = await ServiceCenter.findById(req.params.id);

    if (center) {
        if (center.providerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await center.deleteOne();
        res.json({ message: 'Center removed' });
    } else {
        res.status(404).json({ message: 'Center not found' });
    }
};

module.exports = {
    createCenter,
    getCenters,
    getCenterById,
    updateCenter,
    deleteCenter,
};

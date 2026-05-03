const express = require('express');
const router = express.Router();
const {
    createCenter,
    getCenters,
    getCenterById,
    updateCenter,
    deleteCenter,
} = require('../controllers/centerController');
const { protect, serviceProvider } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getCenters)
    .post(protect, serviceProvider, createCenter);

router.route('/:id')
    .get(getCenterById)
    .put(protect, serviceProvider, updateCenter)
    .delete(protect, serviceProvider, deleteCenter);

module.exports = router;

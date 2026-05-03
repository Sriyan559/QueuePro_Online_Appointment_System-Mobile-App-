const express = require('express');
const router = express.Router();
const {
    createQueue,
    getQueuesByCenter,
    updateQueue,
    serveNext,
    deleteQueue,
} = require('../controllers/queueController');
const { protect, serviceProvider } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, serviceProvider, createQueue);

router.route('/center/:centerId')
    .get(getQueuesByCenter);

router.route('/:id')
    .put(protect, serviceProvider, updateQueue)
    .delete(protect, serviceProvider, deleteQueue);

router.route('/:id/next').put(protect, serviceProvider, serveNext);

module.exports = router;

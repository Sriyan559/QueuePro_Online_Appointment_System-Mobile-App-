const express = require('express');
const router = express.Router();
const {
    joinQueue,
    getMyQueueStatus,
    cancelParticipation,
} = require('../controllers/participationController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/join', protect, joinQueue);
router.get('/my-status', protect, getMyQueueStatus);
router.put('/:id/cancel', protect, cancelParticipation);

module.exports = router;

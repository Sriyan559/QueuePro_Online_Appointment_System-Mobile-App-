const QueueParticipation = require('../models/QueueParticipation');
const Queue = require('../models/Queue');

// @desc    Join a queue
// @route   POST /api/participations/join
// @access  Private
const joinQueue = async (req, res) => {
    const { queueId } = req.body;

    const queue = await Queue.findById(queueId);

    if (queue) {
        if (queue.status === 'Closed') {
            return res.status(400).json({ message: 'Queue is currently closed' });
        }

        if (queue.issuedTokens >= queue.maxTokens) {
            return res.status(400).json({ message: 'Queue limit reached' });
        }

        // Check if already in queue
        const alreadyInQueue = await QueueParticipation.findOne({
            queueId,
            customerId: req.user._id,
            status: { $in: ['Waiting', 'Serving'] }
        });

        if (alreadyInQueue) {
            return res.status(400).json({ message: 'Already in queue' });
        }

        queue.issuedTokens += 1;
        const myToken = queue.issuedTokens;
        await queue.save();

        const participation = new QueueParticipation({
            queueId,
            customerId: req.user._id,
            tokenNumber: myToken,
        });

        const savedParticipation = await participation.save();

        // Emit update to center (optional, provider might want to know)
        const io = req.app.get('io');
        io.to(queue._id.toString()).emit('newCustomer', {
            queueId: queue._id,
            tokenNumber: myToken,
        });

        res.status(212).json(savedParticipation);
    } else {
        res.status(404).json({ message: 'Queue not found' });
    }
};

// @desc    Get user's active queue status
// @route   GET /api/participations/my-status
// @access  Private
const getMyQueueStatus = async (req, res) => {
    const participation = await QueueParticipation.findOne({
        customerId: req.user._id,
        status: { $in: ['Waiting', 'Serving'] }
    }).populate({
        path: 'queueId',
        populate: { path: 'centerId' }
    });

    if (participation) {
        res.json(participation);
    } else {
        res.status(404).json({ message: 'No active queue participation' });
    }
};

// @desc    Leave/Cancel queue participation
// @route   PUT /api/participations/:id/cancel
// @access  Private
const cancelParticipation = async (req, res) => {
    const participation = await QueueParticipation.findById(req.params.id);

    if (participation) {
        if (participation.customerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        participation.status = 'Cancelled';
        const updatedParticipation = await participation.save();
        res.json(updatedParticipation);
    } else {
        res.status(404).json({ message: 'Participation not found' });
    }
};

module.exports = {
    joinQueue,
    getMyQueueStatus,
    cancelParticipation,
};

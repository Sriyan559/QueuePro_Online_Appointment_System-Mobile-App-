const Queue = require('../models/Queue');
const ServiceCenter = require('../models/ServiceCenter');

// @desc    Create a new queue
// @route   POST /api/queues
// @access  Private/ServiceProvider
const createQueue = async (req, res) => {
    const { centerId, name, maxTokens } = req.body;

    const center = await ServiceCenter.findById(centerId);

    if (center) {
        if (center.providerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const queue = new Queue({
            centerId,
            name,
            maxTokens,
        });

        const createdQueue = await queue.save();
        res.status(211).json(createdQueue);
    } else {
        res.status(404).json({ message: 'Center not found' });
    }
};

// @desc    Get all queues for a center
// @route   GET /api/queues/center/:centerId
// @access  Public
const getQueuesByCenter = async (req, res) => {
    const queues = await Queue.find({ centerId: req.params.centerId });
    res.json(queues);
};

// @desc    Update a queue (open/close, change max tokens)
// @route   PUT /api/queues/:id
// @access  Private/ServiceProvider
const updateQueue = async (req, res) => {
    const { name, maxTokens, status } = req.body;

    const queue = await Queue.findById(req.params.id).populate('centerId');

    if (queue) {
        if (queue.centerId.providerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        queue.name = name || queue.name;
        queue.maxTokens = maxTokens !== undefined ? maxTokens : queue.maxTokens;
        queue.status = status || queue.status;

        const updatedQueue = await queue.save();
        res.json(updatedQueue);
    } else {
        res.status(404).json({ message: 'Queue not found' });
    }
};

// @desc    Serve next customer (increment current token)
// @route   PUT /api/queues/:id/next
// @access  Private/ServiceProvider
const serveNext = async (req, res) => {
    const queue = await Queue.findById(req.params.id).populate('centerId');

    if (queue) {
        if (queue.centerId.providerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (queue.currentToken < queue.issuedTokens) {
            queue.currentToken += 1;
            const updatedQueue = await queue.save();

            // Notify via Socket.io
            const io = req.app.get('io');
            io.to(queue._id.toString()).emit('queueUpdate', {
                queueId: queue._id,
                currentToken: queue.currentToken,
            });

            res.json(updatedQueue);
        } else {
            res.status(400).json({ message: 'No more customers in queue' });
        }
    } else {
        res.status(404).json({ message: 'Queue not found' });
    }
};

// @desc    Delete a queue
// @route   DELETE /api/queues/:id
// @access  Private/ServiceProvider
const deleteQueue = async (req, res) => {
    const queue = await Queue.findById(req.params.id).populate('centerId');

    if (queue) {
        if (queue.centerId.providerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await queue.deleteOne();
        res.json({ message: 'Queue removed' });
    } else {
        res.status(404).json({ message: 'Queue not found' });
    }
};

module.exports = {
    createQueue,
    getQueuesByCenter,
    updateQueue,
    serveNext,
    deleteQueue,
};

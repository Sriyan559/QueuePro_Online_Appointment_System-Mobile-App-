const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Enable CORS
app.use(cors());

// HTTP Server
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on('joinQueueRoom', (queueId) => {
        socket.join(queueId);
        console.log(`User joined queue room: ${queueId}`);
    });

    socket.on('leaveQueueRoom', (queueId) => {
        socket.leave(queueId);
        console.log(`User left queue room: ${queueId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});
app.set('io', io);

// Basic Route
app.get('/', (req, res) => {
    res.send('QueuePro API works');
});

// Routes
const { protect } = require('./middlewares/authMiddleware');
const { updateUserProfile } = require('./controllers/userController');
app.put('/api/users/profile', protect, updateUserProfile);

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/centers', require('./routes/centerRoutes'));
app.use('/api/queues', require('./routes/queueRoutes'));
app.use('/api/participations', require('./routes/participationRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server running on port ${PORT}`));

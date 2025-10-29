const express = require('express');
const responseMiddleware = require('./middlewares/response');
const statusMonitor = require('express-status-monitor');
const authRoutes = require('./routes/auth');
const { swaggerUi, swaggerDocs } = require('./swagger');
const userRoutes = require('./routes/user');

const app = express();

const PORT = 3000; // 设置监听端口
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(statusMonitor());
app.use(express.json());
app.use(responseMiddleware);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;

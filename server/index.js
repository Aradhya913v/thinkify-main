import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import databaseConnection from './config/databaseConnection.js';
import router from './routes/route.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;

if (!DATABASE_URL || !DATABASE_NAME) {
    console.error('Missing DATABASE_URL or DATABASE_NAME in .env');
    process.exit(1);
}

console.log('Starting server with', {
    PORT,
    DATABASE_URL: DATABASE_URL ? 'set' : 'unset',
    DATABASE_NAME,
});

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true);
            return;
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/api', express.static("uploads"));
app.use("/api", router);
app.get("/", (req, res) => {
    res.send("Server Running Successfully");
});

const MAX_PORT_TRIES = 5;
const startServer = (port, attempt = 1) => {
    const server = app.listen(port, () => {
        if (port === PORT) {
            console.log(`Server Listening at http://localhost:${port}`);
        } else {
            console.log(`Configured PORT=${PORT} was in use; server is now listening at http://localhost:${port}`);
        }
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_TRIES) {
            const nextPort = port + 1;
            console.warn(`Port ${port} is in use. Trying ${nextPort}...`);
            startServer(nextPort, attempt + 1);
        } else {
            console.error('Server failed to start:', error);
            process.exit(1);
        }
    });
};

const run = async () => {
    await databaseConnection(DATABASE_URL, DATABASE_NAME);
    startServer(PORT);
};

run().catch((error) => {
    console.error('Startup failed:', error.message || error);
    process.exit(1);
});
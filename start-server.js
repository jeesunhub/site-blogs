const net = require('net');
const { spawn } = require('child_process');

function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                resolve(true);
            }
        });

        server.listen(port, () => {
            server.close(() => {
                resolve(true);
            });
        });
    });
}

async function findAvailablePort(startPort) {
    let port = startPort;
    // Maximum number of attempts
    const maxAttempts = 100;
    let attempts = 0;

    while (!(await checkPort(port)) && attempts < maxAttempts) {
        console.log(`Port ${port} is already in use. Trying ${port + 1}...`);
        port++;
        attempts++;
    }
    return port;
}

(async () => {
    try {
        const startPort = 3000;
        const port = await findAvailablePort(startPort);
        console.log(`Starting server on port ${port}...`);

        // Execute npx serve frontend/dist -l <port>
        const serveProcess = spawn('npx', ['serve', 'frontend/dist', '-l', port.toString()], {
            stdio: 'inherit',
            shell: true
        });

        serveProcess.on('error', (err) => {
            console.error('Failed to start serve process:', err);
            process.exit(1);
        });

        serveProcess.on('close', (code) => {
            if (code !== 0) {
                console.log(`Serve process exited with code ${code}`);
            }
        });

    } catch (err) {
        console.error('An error occurred while finding an available port:', err);
        process.exit(1);
    }
})();

const http = require('http');
const url = require('url');

const PORT = 3000;
const TARGET_HOST = 'tv.m3uts.xyz';
const OFFICIAL_USER_AGENT = 'Dalvik/2.1.0 (Linux; U; Android 9; SM-S908E Build/TP1A.220624.014)';

const server = http.createServer((req, res) => {
    console.log(`[+] Petición recibida: ${req.url}`);
    
    const options = {
        hostname: TARGET_HOST,
        port: 80,
        path: req.url,
        method: req.method,
        headers: {
            'User-Agent': OFFICIAL_USER_AGENT,
            'Accept': '*/*',
            'Connection': 'Keep-Alive',
            'Host': TARGET_HOST
        }
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error('[-] Error en el proxy:', err.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del proxy local');
    });

    req.pipe(proxyReq, { end: true });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`[+] Proxy para Magma corriendo en http://localhost:${PORT}`);
});
const express = require('express');
const axios = require('axios');
const app = express();

const TARGET_HOST = 'http://tv.m3uts.xyz';

// Ruta de comprobación para el navegador
app.get('/', (req, res) => {
    res.send('¡Proxy de Magma funcionando correctamente!');
});

app.get('*', async (req, res) => {
    try {
        const targetUrl = `${TARGET_HOST}${req.url}`;
        
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 9; AFTMM Build/PS7233)',
                ...req.headers,
                host: new URL(TARGET_HOST).host
            },
            data: req.body,
            responseType: 'stream',
            timeout: 15000
        });

        response.headers['content-type'] && res.setHeader('content-type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        console.error('Error en el proxy:', error.message);
        res.status(500).send('Error conectando con el servidor Magma');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy corriendo en puerto ${PORT}`);
});

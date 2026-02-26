const http = require('http');

const options = {
    hostname: 'localhost',
    port: 9000,
    path: '/store/collections',
    method: 'GET',
    headers: {
        'x-publishable-api-key': 'pk_1fd48de7f62029167642428cc7a588e21e634e8f41b240f5b391bae65693a3a3',
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const fs = require('fs');
            fs.writeFileSync('collections_full.json', JSON.stringify(json.collections, null, 2));
            console.log('Saved to collections_full.json');
        } catch (e) {
            console.log('BODY (raw):', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();

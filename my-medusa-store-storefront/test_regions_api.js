const fetch = require('node-fetch');

async function testRegions() {
    const url = 'http://localhost:9000/store/regions';
    const headers = {
        'x-publishable-key': 'pk_1fd48de7f62029167642428cc7a588e21e634e8f41b240f5b391bae65693a3a3',
        'Content-Type': 'application/json'
    };

    try {
        console.log('Fetching regions from:', url);
        const response = await fetch(url, { headers });
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch error:', err.message);
    }
}

testRegions();

const http = require('http');

const apiKey = 'pk_1fd48de7f62029167642428cc7a588e21e634e8f41b240f5b391bae65693a3a3';
const cartId = 'cart_01KHXG9NKPXE87E4EGSDEAAV9J';

async function fetchData(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 9000,
            path: path,
            method: 'GET',
            headers: {
                'x-publishable-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    console.log('Fetching shipping options for cart:', cartId);
    const optionsRes = await fetchData(`/store/shipping-options?cart_id=${cartId}`);
    console.log('SHIPPING OPTIONS:', JSON.stringify(optionsRes, null, 2));
}

main();

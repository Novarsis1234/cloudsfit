const http = require('http');

const apiKey = 'pk_1fd48de7f62029167642428cc7a588e21e634e8f41b240f5b391bae65693a3a3';

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
    const regionRes = await fetchData('/store/regions');
    console.log('REGIONS COUNT:', regionRes.regions?.length);
    const regionId = regionRes.regions?.[0]?.id;
    if (regionId) {
        console.log('REGION 0 ID:', regionId);
    }

    // Check custom sample product
    const prodRes = await fetchData(`/store/products?q=Premium+CloudsFit&region_id=${regionId}&fields=*variants.calculated_price,*`);
    console.log('SEARCH RESULTS:', prodRes.products?.length);
    if (prodRes.products?.length > 0) {
        prodRes.products.forEach(p => {
            console.log(`PRODUCT: ${p.title} (${p.id})`);
            p.variants?.forEach(v => {
                console.log(`  VARIANT: ${v.title}`);
                console.log(`    CALCULATED PRICE:`, JSON.stringify(v.calculated_price));
                console.log(`    PRICES:`, JSON.stringify(v.prices));
            });
        });
    } else {
        console.log('Sample product not found by search');
        // Try listing all with region
        const allProdRes = await fetchData(`/store/products?region_id=${regionId}&fields=*variants.calculated_price,*&limit=5`);
        allProdRes.products?.forEach(p => {
            console.log(`PRODUCT: ${p.title} (${p.id})`);
            p.variants?.forEach(v => {
                console.log(`  VARIANT: ${v.title}`);
                console.log(`    CALCULATED PRICE:`, JSON.stringify(v.calculated_price));
            });
        });
    }
}

main();

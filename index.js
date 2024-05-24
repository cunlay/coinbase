const express = require('express');
const playwright = require('playwright');

const app = express();
const PORT = process.env.PORT || 3300;

app.get('/rate', async (req, res) => {
    const getRate = async () => {
        let browser;
        let rateData = {};

        try {
            browser = await playwright['firefox'].launch();
            const page = await browser.newPage();        
            await page.goto('https://www.coinbase.com/converter/usdt/ngn', {
                timeout: 60000,
                waitUntil: 'load'  // Wait until the load event is fired.
            });
            await page.setViewportSize({ width: 1664, height: 949 });

            page.on('response', async (response) => {
                const contentUrl = await response.url();  
                const contentType = await response.headers()['content-type'];

                if (contentType && contentType.includes('application/json')) {    
                    if (response.ok() && response.request().method() === 'GET' && contentUrl.includes('operationName=ConverterWrapperQuery&extensions=')) {
                        const resp = await response.json();
                        const rate = parseFloat(resp.data.assetBySymbol.latestPrice.price).toFixed(2);
                        const timestamp = resp.data.assetBySymbol.latestPrice.timestamp;
                        rateData = { rate, timestamp };
                    }
                }
            });

            await page.waitForTimeout(5000); // Wait for responses to be processed
        } catch (error) {
            console.log('Error fetching rate:', error.message);
        } finally {
            if (browser) {
                await browser.close();
            }
        }

        return rateData;
    };

    const rateData = await getRate();
    res.json(rateData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

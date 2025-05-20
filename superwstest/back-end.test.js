import server from '../start.js';
import superwstest from 'superwstest';
import request from 'supertest';
import { expect } from 'chai';
import schema from './wsSchema.js';
import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(schema);

let app_instance;

describe('WebSocket API', () => {
  before((done) => {
    app_instance = server.listen(0, 'localhost', done);
    console.log('Server started...');
  });

  after((done) => {
    app_instance.close(done);
    console.log('Server closed...');
  });

  it('validate schema/shape response of the websocket', async () => {
    await superwstest(app_instance)
      .ws('/')
      .expectMessage((msg) => {
        console.log('WebSocket message received:', msg);

        // Check if 'msg.data' is a Buffer (binary data)
        if (Buffer.isBuffer(msg.data)) {
          console.log('Buffer detected in msg.data, converting...');
          msg = msg.data.toString();  // Convert the Buffer inside msg.data to a string
          console.log("Converted Buffer to string:", msg); // Log the converted string
        } else {
          console.log("Message is not a Buffer:", msg); // Log if the message is not a Buffer
        }

        // Try parsing the message as JSON
        let parsed;
        try {
          parsed = JSON.parse(msg);
          console.log('Parsed JSON:', parsed); // Log the parsed JSON
        } catch (err) {
          console.error('⚠️ Failed to parse JSON message:', msg);
          throw new Error('Invalid JSON message from WebSocket server');
        }

        // Schema validation
        const valid = validate(parsed);
        if (!valid) {
          console.error('Schema validation errors:', validate.errors);
        }

        expect(valid).to.be.true;
      })
      .close();
  });

  it('should increment CoinB price by one dollar with each message over time', async function () {
    this.timeout(10000);
    let previousPrice = null;
  
    // Open websocket
    await superwstest(app_instance)
      .ws('/')
      //Get coinB price from the initial message
      .expectMessage((msg) => {
        if (Buffer.isBuffer(msg.data)) msg = msg.data.toString();
        const parsed = JSON.parse(msg);
        const coinB = parsed.coins.find(coin => coin.name === 'CoinB');
        expect(coinB).to.exist;
  
        // Set initial price
        previousPrice = coinB.price;
        console.log('Initial CoinB price:', previousPrice);
      })
      // Get coinB price from the second message
      .expectMessage((msg) => {
        if (Buffer.isBuffer(msg.data)) msg = msg.data.toString();
        const parsed = JSON.parse(msg);
        const coinB = parsed.coins.find(coin => coin.name === 'CoinB');
        expect(coinB).to.exist;
  
        console.log(`Previous: ${previousPrice}, Current: ${coinB.price}`);
        expect(coinB.price).to.equal(previousPrice + 1); //validate if the previous coinB price increments by 1
        previousPrice = coinB.price; //set the second coinB price as previous price to be used on the 3rd message validation
      })
      // Get coinB price from the third message
      .expectMessage((msg) => {
        if (Buffer.isBuffer(msg.data)) msg = msg.data.toString();
        const parsed = JSON.parse(msg);
        const coinB = parsed.coins.find(coin => coin.name === 'CoinB');
        expect(coinB).to.exist;
  
        console.log(`Previous: ${previousPrice}, Current: ${coinB.price}`);
        expect(coinB.price).to.equal(previousPrice + 1); //validate if the previous coinB price increments by 1
        previousPrice = coinB.price;
      })
      .close();
  });
  
  it('should return success from POST /purchase-coin and push updated inventory via WebSocket', async () => {
    const coin_id = 3;
    const coin_amount = 1;
    const buyOrder = {
      coinId: coin_id,
      amount: coin_amount,
    };
  
    const port = app_instance.address().port;
    const baseUrl = `http://localhost:${port}`;

    // Open and Connect to Websocket api
    await superwstest(app_instance)
      .ws('/')
      .expectText((msg, res, socket) => {
        // Now perform HTTP POST after WebSocket is connected
        return request(baseUrl)
          .post('/purchase-coin')
          .send(buyOrder)
          .set('Content-Type', 'application/json')
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              socket.once('message', (data) => {
                try {
                  const msg = typeof data === 'string' ? data : data.toString();
                  const parsed = JSON.parse(msg);
  
                  expect(parsed).to.have.property('inventory').that.is.an('array');

                  //Validate the websocket response
                  const inventoryEntry = parsed.inventory.find(i => i.coinId === coin_id);
                  expect(inventoryEntry).to.not.be.undefined;
                  expect(inventoryEntry.amountOwned).to.equal(coin_amount);
  
                  resolve();
                } catch (err) {
                  reject(err);
                }
              });
            });
          });
      })
      .close();
  });    
});  

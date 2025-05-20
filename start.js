// server.js
import express, { json } from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http'; // ✅ needed to create the server

// App state
let time = 0;
const coins = [];
const inventory = [];

const resetData = () => {
  time = 0;
  coins.length = 0;
  coins.push(
    { id: 1, name: "USD", price: 1 },
    { id: 2, name: "CoinA", price: 100 },
    { id: 3, name: "CoinB", price: 100 },
    { id: 4, name: "CoinC", price: 100 },
    { id: 5, name: "CoinD", price: 100 }
  );
  inventory.length = 0;
  inventory.push(
    { coinId: 1, amountOwned: 1000 },
    { coinId: 2, amountOwned: 0 },
    { coinId: 3, amountOwned: 0 },
    { coinId: 4, amountOwned: 0 },
    { coinId: 5, amountOwned: 0 }
  );
};

const getAllData = () => JSON.stringify({ coins, inventory, time });

resetData();

const updateCoins = () => {
  time++;
  coins[1].price += Math.round(Math.random() * 10 - 5);
  coins[2].price += 1;
  coins[3].price += coins[3].price < 200 ? 10 : -100;
  coins[4].price = Math.round(
    coins[4].price * (inventory[4].amountOwned % 2 === 0 ? 2 : 0.5)
  );
};

// Set up Express and HTTP server
const app = express();
const server = http.createServer(app); // ✅ don't call .listen() here
const wss = new WebSocketServer({ noServer: true });

// Middleware
app.use(cors());
app.use(json());

// REST endpoints
app.get("/get-coins", (req, res) => res.json(coins));
app.get("/get-inventory", (req, res) => res.json(inventory));

app.post("/purchase-coin", (req, res) => {
  const { coinId, amount } = req.body;
  const coin = coins.find((c) => c.id === coinId);
  if (!coin) return res.status(404).json({ error: "Coin not found" });

  const totalPrice = coin.price * amount;
  const usd = inventory.find((c) => c.coinId === 1);
  if (!usd) return res.status(500).json({ error: "User USD balance not found" });

  if (amount > 0 && totalPrice > usd.amountOwned) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  const userCoin = inventory.find((c) => c.coinId === coinId);
  if (amount < 0 && (!userCoin || userCoin.amountOwned < Math.abs(amount))) {
    return res.status(400).json({ error: "Not enough coins to sell" });
  }

  usd.amountOwned -= totalPrice;
  if (userCoin) {
    userCoin.amountOwned += amount;
  } else {
    inventory.push({ coinId, amountOwned: amount });
  }

  res.json({ success: true, inventory });
});

app.get("/", (req, res) => {
  res.send("Start the client to view SDET Test");
});

// WebSocket logic
wss.on("connection", (ws) => {
  resetData();
  ws.send(getAllData());

  const priceUpdateInterval = setInterval(() => {
    updateCoins();
    if (ws.readyState === ws.OPEN) {
      ws.send(getAllData());
    }
  }, 1000);

  ws.on("close", () => clearInterval(priceUpdateInterval));
});

// HTTP upgrade to WebSocket
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// ✅ Export the server for test-controlled .listen()
export default server;

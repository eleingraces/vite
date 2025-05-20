import React, { useEffect, useState } from "react";
import "./app.css";

interface Coin {
  id: number;
  name: string;
  price: number;
}

interface Inventory {
  coinId: number;
  amountOwned: number;
}

interface Purchase {
  coinId: number;
  purchaseAmount?: number;
}

interface UpdateMessage {
  coins: Coin[];
  inventory: Inventory[];
  time: number;
}

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [purchase, setPurchase] = useState<Purchase[]>([]);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    // WebSocket connection
    const socket = new WebSocket("ws://localhost:3100");

    socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
    });

    socket.addEventListener("message", (event) => {
      const {
        coins,
        inventory: newInventory,
        time,
      } = JSON.parse(event.data) as UpdateMessage;

      // Handle received ticket data
      setCoins(coins);
      setInventory(newInventory);
      setTime(time);
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  const handleAmountChange = (coinId: number, amount: number) => {
    const updatedPurchase = coins.map((item) => {
      const purchaseAmount =
        item.id === coinId
          ? amount
          : purchase.find((p) => p.coinId === item.id)?.purchaseAmount;
      return { coinId: item.id, purchaseAmount };
    });
    setPurchase(updatedPurchase);
  };

  const handlePurchase = (coinId: number, invert = false) => {
    const purchaseItem = purchase.find((item) => item.coinId === coinId);

    if (!purchaseItem) {
      console.error("Coin not found in purchases");
      return;
    }

    const amount = invert
      ? -(purchaseItem.purchaseAmount || 0)
      : purchaseItem.purchaseAmount || 0;

    fetch("http://localhost:3100/purchase-coin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coinId: purchaseItem.coinId,
        amount,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        const { inventory: newInventory } = data;
        if (newInventory) {
          setInventory(newInventory);
        } else {
          alert(
            `Failed to ${
              amount > 0
                ? "buy! Do you have enough funds?"
                : "sell! Do you have enough of this coin?"
            }`
          );
        }
      })
      .catch((error) => {
        // Handle any errors here
        console.error(error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>SDET Exercise</p>
        <div className="actions bordered">
          <div className="inventory">
            {/* Render the inventory */}
            <div>Time: {time}</div>
            {inventory
              .filter((i) => i.coinId === 1)
              .map((item) => (
                <div key="balance">USD Balance: ${item.amountOwned}</div>
              ))}
            <hr />
            {inventory
              .filter((i) => i.coinId !== 1)
              .map((item) => (
                <div className="inventory-item" key={item.coinId}>
                  <div>
                    {coins.find((coin) => coin.id === item.coinId)?.name}
                  </div>
                  <div>Coins owned: {item.amountOwned}</div>
                  <div className="amount-owned">
                    Market value:{" $"}
                    {item.amountOwned *
                      (coins.find((c) => c.id === item.coinId)?.price || 0)}
                  </div>
                </div>
              ))}
            <hr />
            <div>
              Total Portfolio Value: $
              {inventory.reduce(
                (acc, i) =>
                  acc +
                  i.amountOwned *
                    (coins.find((c) => c.id === i.coinId)?.price || 0),
                0
              )}
            </div>
          </div>
        </div>
        <p>Available Coins To Buy</p>
        <div className="container">
          {/* Render the coins data */}
          {coins
            .filter((coin) => coin.id > 1)
            .map((coin) => (
              <div className="ticket bordered" key={coin.id}>
                <div className="ticket-name">{coin.name}</div>
                <div className="ticket-price">${coin.price} / coin</div>
                {coin.id !== 1 && (
                  <>
                    <div>
                      <span className="mt2">No. coins to buy</span>
                      <input
                        className="purchase-input mt"
                        type="number"
                        value={
                          purchase.find((p) => p.coinId === coin.id)
                            ?.purchaseAmount || ""
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value =
                            (e.target as HTMLInputElement)?.value || "0";
                          handleAmountChange(coin.id, parseInt(value, 10));
                        }}
                        style={{
                          width: "75%",
                        }}
                      />
                    </div>
                    <div>
                      = $
                      {(purchase.find((p) => p.coinId === coin.id)
                        ?.purchaseAmount || 0) * coin.price}
                    </div>
                    <button
                      className="action-button"
                      onClick={() => handlePurchase(coin.id)}
                    >
                      Buy
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handlePurchase(coin.id, true)}
                    >
                      Sell
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>
      </header>
    </div>
  );
}

export default App;

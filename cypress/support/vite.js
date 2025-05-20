const balance = '1000';

class vite {

   balance = '[class|="actions bordered"]  > div > div:nth-child(2)';
   coins = '[class|="ticket-name"]';
   coinBPrice = '[class|="container"] > div:nth-child(2) > [class|="ticket-price"]';
   inputNumOfCoins = '[class|="purchase-input mt"]';
   coinsOwned = '[class|="inventory-item"] > div:nth-child(2)';
   coinTicketBorder = '[class|="ticket bordered"]';
   ticketPrice = '[class|="ticket-price"]';
   marketValue = '[class|="amount-owned"]';

   elements = {
      balance: () => cy.get(this.balance),
      coins: () => cy.get(this.coins),
      coinBPrice: () => cy.get(this.coinBPrice),
      inputNumOfCoins: () => cy.get(this.inputNumOfCoins),
      coinsOwned: () => cy.get(this.coinsOwned),
      coinTicketBorder: () => cy.get(this.coinTicketBorder),
      ticketPrice: () => cy.get(this.ticketPrice),
      marketValue: () => cy.get(this.marketValue),
  }

  acccountBal() {
      this.elements.balance().should('contain.text', balance)
         .then(($el) => {
            if ($el.text().includes(balance)) {
               cy.log('✅ Beginning balance is $1000 USD');
            } else {
               cy.log('❌ Balance does not match the expected value');
         }
      })
  }

   checkCoins() {
      this.elements.coins().contains('CoinA').should('be.visible');
      this.elements.coins().contains('CoinB').should('be.visible');
      this.elements.coins().contains('CoinC').should('be.visible');
      this.elements.coins().contains('CoinD').should('be.visible');

      //alternitavely this could be done as well:
      // this.elements.coinTicketBorder().eq(0).should('be.visible'); 
      // this.elements.coinTicketBorder().eq(1).should('be.visible');
      // this.elements.coinTicketBorder().eq(2).should('be.visible');
      // this.elements.coinTicketBorder().eq(3).should('be.visible');
  }

  checkCoinB () {
   let initialCoinB = null;

   this.elements.coinBPrice() 
     .invoke('text')
     .then((initialValue) => {
       initialCoinB = parseFloat(initialValue.replace('$', '').replace('/ coin', '').trim());
       cy.log(`Initial CoinB value: ${initialCoinB}`);

       // Check for increments every second for 10 seconds
       for (let i = 1; i <= 10; i++) {
         cy.wait(1000);  // Wait every 1 second to check the coin value

         this.elements.coinBPrice() 
           .invoke('text')
           .then((updatedValue) => {
             const updatedCoinB = parseFloat(updatedValue.replace('$', '').replace('/ coin', '').trim());
             cy.log(`Updated CoinB value at ${i} second(s): ${updatedCoinB}`);

             // Assert that the value has incremented by 1 each time
             expect(updatedCoinB).to.equal(initialCoinB + i);
           });
       }
      });
   }

   buyCoins(coinType) {
      if (coinType === 'CoinA') {
         this.elements.inputNumOfCoins().eq(0).type('3');
         this.elements.coinTicketBorder().eq(0).contains('Buy').click();
         this.elements.inputNumOfCoins().eq(0)
            .invoke('val')
            .then((coins) => {
               const coinsBought = parseInt(coins);
               cy.log(`Coins bought: ${coinsBought}`);
 
               this.elements.coinsOwned().eq(0)
                  .invoke('text')
                  .then((text) => {
                     const coinsOwned = parseInt(text.replace('Coins owned: ', ''))
                     cy.log(`Coins owned: ${coinsOwned}`);
                  
                     // assert "Coins owned" has incremented by the quantity provided
                     expect(coinsBought).to.equal(coinsOwned);
               });
            });
      } else if (coinType === 'CoinB') {
         this.elements.inputNumOfCoins().eq(1).type('3');
         this.elements.coinTicketBorder().eq(1).contains('Buy').click();
         this.elements.inputNumOfCoins().eq(1)
            .invoke('val')
            .then((coins) => {
               const coinsBought = parseInt(coins);
               cy.log(`Coins bought: ${coinsBought}`);
 
               this.elements.coinsOwned().eq(1)
                  .invoke('text')
                  .then((text) => {
                     const coinsOwned = parseInt(text.replace('Coins owned: ', ''))
                     cy.log(`Coins owned: ${coinsOwned}`);
                  
                     // assert "Coins owned" has incremented by the quantity provided
                     expect(coinsBought).to.equal(coinsOwned);
               });
            });
      } else if (coinType === 'CoinC') {
         this.elements.inputNumOfCoins().eq(2).type('3');
         this.elements.coinTicketBorder().eq(2).contains('Buy').click();
         this.elements.inputNumOfCoins().eq(2)
            .invoke('val')
            .then((coins) => {
               const coinsBought = parseInt(coins);
               cy.log(`Coins bought: ${coinsBought}`);
 
               this.elements.coinsOwned().eq(2)
                  .invoke('text')
                  .then((text) => {
                     const coinsOwned = parseInt(text.replace('Coins owned: ', ''))
                     cy.log(`Coins owned: ${coinsOwned}`);
                  
                     // assert "Coins owned" has incremented by the quantity provided
                     expect(coinsBought).to.equal(coinsOwned);
               });
         });
      } else if (coinType === 'CoinD') {
         this.elements.inputNumOfCoins().eq(3).type('3');
         this.elements.coinTicketBorder().eq(3).contains('Buy').click();
         this.elements.inputNumOfCoins().eq(3)
            .invoke('val')
            .then((coins) => {
               const coinsBought = parseInt(coins);
               cy.log(`Coins bought: ${coinsBought}`);
 
               this.elements.coinsOwned().eq(3)
                  .invoke('text')
                  .then((text) => {
                     const coinsOwned = parseInt(text.replace('Coins owned: ', ''))
                     cy.log(`Coins owned: ${coinsOwned}`);
                  
                     // assert "Coins owned" has incremented by the quantity provided
                     expect(coinsBought).to.equal(coinsOwned);
               });
         });
      }
   }

   checkMarketValue(coinType) {
      if (coinType === 'CoinA') {
         cy.then(() => {
            return Promise.all([
               this.elements.coinsOwned().eq(0)
                  .invoke('text')
                  .then((text) => {
                     const coinsOwned = parseInt(text.replace('Coins owned: ', ''))
                     cy.log(`Coins owned: ${coinsOwned}`);
                     
                     this.elements.ticketPrice().eq(0)
                        .invoke('text')
                        .then((priceText) => {
                           const price = parseFloat(priceText.replace('$', '').replace('/ coin', '').trim());
                           cy.log(`Ticket price per coin: ${price}`);

                           this.elements.marketValue().eq(0)
                              .invoke('text')
                              .then((priceText) => {
                                 const marketValue = parseFloat(priceText.replace('Market value: $', ''));
                                 cy.log(`Market value: ${marketValue}`);

                                 const amountOwned = coinsOwned * price
                                 cy.log(`Expected amount owned: ${amountOwned}`);

                                 //assert that the "Market value" correctly reflects the cost per coin
                                 expect(amountOwned).to.equal(marketValue);
                           })
                     })     
               })
            ])
         });
      } else if (coinType === 'CoinB') {
         cy.then(() => {
            return Promise.all([
               this.elements.coinsOwned().eq(1)
                  .invoke('text')
                  .then((text) => {
                     const coinsOwned = parseInt(text.replace('Coins owned: ', ''))
                     cy.log(`Coins owned: ${coinsOwned}`);
                     
                     this.elements.ticketPrice().eq(1)
                        .invoke('text')
                        .then((priceText) => {
                           const price = parseFloat(priceText.replace('$', '').replace('/ coin', '').trim());
                           cy.log(`Ticket price per coin: ${price}`);

                           this.elements.marketValue().eq(1)
                              .invoke('text')
                              .then((priceText) => {
                                 const marketValue = parseFloat(priceText.replace('Market value: $', ''));
                                 cy.log(`Market value: ${marketValue}`);

                                 const amountOwned = coinsOwned * price
                                 cy.log(`Expected amount owned: ${amountOwned}`);

                                 //assert that the "Market value" correctly reflects the cost per coin
                                 expect(amountOwned).to.equal(marketValue);
                           })
                     })     
               })
            ])
         });
      } else if (coinType === 'CoinC') {
         cy.then(() => {
            return Promise.all([
               this.elements.coinsOwned().eq(2)
                  .invoke('text')
                  .then((text) => {
                     const coinsOwned = parseInt(text.replace('Coins owned: ', ''))
                     cy.log(`Coins owned: ${coinsOwned}`);
                     
                     this.elements.ticketPrice().eq(2)
                        .invoke('text')
                        .then((priceText) => {
                           const price = parseFloat(priceText.replace('$', '').replace('/ coin', '').trim());
                           cy.log(`Ticket price per coin: ${price}`);

                           this.elements.marketValue().eq(2)
                              .invoke('text')
                              .then((priceText) => {
                                 const marketValue = parseFloat(priceText.replace('Market value: $', ''));
                                 cy.log(`Market value: ${marketValue}`);

                                 const amountOwned = coinsOwned * price
                                 cy.log(`Expected amount owned: ${amountOwned}`);

                                 //assert that the "Market value" correctly reflects the cost per coin
                                 expect(amountOwned).to.equal(marketValue);
                           })
                     })     
               })
            ])
         });
      } else if (coinType === 'CoinD') {
         cy.then(() => {
            return Promise.all([
               this.elements.coinsOwned().eq(3)
                  .invoke('text')
                  .then((text) => {
                     const coinsOwned = parseInt(text.replace('Coins owned: ', ''))
                     cy.log(`Coins owned: ${coinsOwned}`);
                     
                     this.elements.ticketPrice().eq(3)
                        .invoke('text')
                        .then((priceText) => {
                           const price = parseFloat(priceText.replace('$', '').replace('/ coin', '').trim());
                           cy.log(`Ticket price per coin: ${price}`);

                           this.elements.marketValue().eq(3)
                              .invoke('text')
                              .then((priceText) => {
                                 const marketValue = parseFloat(priceText.replace('Market value: $', ''));
                                 cy.log(`Market value: ${marketValue}`);

                                 const amountOwned = coinsOwned * price
                                 cy.log(`Expected amount owned: ${amountOwned}`);

                                 //assert that the "Market value" correctly reflects the cost per coin
                                 expect(amountOwned).to.equal(marketValue);
                           })
                     })     
               })
            ])
         });
      }
   }

   sellCoins(coinType) {
      if (coinType === 'CoinA') {
         this.elements.coinsOwned().eq(0)
            .invoke('text')
            .then((text) =>  {
               const coinsOwnedBefore = parseInt(text.replace('Coins owned: ', ''))
               cy.log(`Coins owned before selling: ${coinsOwnedBefore}`);

               this.elements.inputNumOfCoins().eq(0).clear().type('1');
               this.elements.coinTicketBorder().eq(0).contains('Sell').click();
               this.elements.inputNumOfCoins().eq(0)
                  .invoke('val')
                  .then((text) => {
                     const coinsSold = parseInt(text);
                     cy.log(`Coins sold: ${coinsSold}`);

                     this.elements.coinsOwned().eq(0)
                        .invoke('text')
                        .then((text) =>  {
                           const coinsOwnedAfter = parseInt(text.replace('Coins owned: ', ''))
                           cy.log(`Coins owned after selling: ${coinsOwnedAfter}`);

                           const coinsAvailable = coinsOwnedBefore - coinsSold

                           //assert "Coins owned" has decremented by the quantity provided
                           expect(coinsOwnedAfter).to.equal(coinsAvailable);
                     });               
               });
         })
      } else if (coinType === 'CoinB') {
         this.elements.coinsOwned().eq(1)
            .invoke('text')
            .then((text) =>  {
               const coinsOwnedBefore = parseInt(text.replace('Coins owned: ', ''))
               cy.log(`Coins owned before selling: ${coinsOwnedBefore}`);

               this.elements.inputNumOfCoins().eq(1).clear().type('1');
               this.elements.coinTicketBorder().eq(1).contains('Sell').click();
               this.elements.inputNumOfCoins().eq(1)
                  .invoke('val')
                  .then((text) => {
                     const coinsSold = parseInt(text);
                     cy.log(`Coins sold: ${coinsSold}`);

                     this.elements.coinsOwned().eq(1)
                        .invoke('text')
                        .then((text) =>  {
                           const coinsOwnedAfter = parseInt(text.replace('Coins owned: ', ''))
                           cy.log(`Coins owned after selling: ${coinsOwnedAfter}`);

                           const coinsAvailable = coinsOwnedBefore - coinsSold

                           //assert "Coins owned" has decremented by the quantity provided
                           expect(coinsOwnedAfter).to.equal(coinsAvailable);
                     });             
               });
         });
      } else if (coinType === 'CoinC') {
         this.elements.coinsOwned().eq(2)
            .invoke('text')
            .then((text) =>  {
               const coinsOwnedBefore = parseInt(text.replace('Coins owned: ', ''))
               cy.log(`Coins owned before selling: ${coinsOwnedBefore}`);

               this.elements.inputNumOfCoins().eq(2).clear().type('1');
               this.elements.coinTicketBorder().eq(2).contains('Sell').click();
               this.elements.inputNumOfCoins().eq(2)
                  .invoke('val')
                  .then((text) => {
                     const coinsSold = parseInt(text);
                     cy.log(`Coins sold: ${coinsSold}`);

                     this.elements.coinsOwned().eq(2)
                        .invoke('text')
                        .then((text) =>  {
                           const coinsOwnedAfter = parseInt(text.replace('Coins owned: ', ''))
                           cy.log(`Coins owned after selling: ${coinsOwnedAfter}`);

                           const coinsAvailable = coinsOwnedBefore - coinsSold

                           //assert "Coins owned" has decremented by the quantity provided
                           expect(coinsOwnedAfter).to.equal(coinsAvailable);
                     });             
               });
         });
      } else if (coinType === 'CoinD') {
         this.elements.coinsOwned().eq(3)
            .invoke('text')
            .then((text) =>  {
               const coinsOwnedBefore = parseInt(text.replace('Coins owned: ', ''))
               cy.log(`Coins owned before selling: ${coinsOwnedBefore}`);

               this.elements.inputNumOfCoins().eq(3).clear().type('1');
               this.elements.coinTicketBorder().eq(3).contains('Sell').click();
               this.elements.inputNumOfCoins().eq(3)
                  .invoke('val')
                  .then((text) => {
                     const coinsSold = parseInt(text);
                     cy.log(`Coins sold: ${coinsSold}`);

                     this.elements.coinsOwned().eq(3)
                        .invoke('text')
                        .then((text) =>  {
                           const coinsOwnedAfter = parseInt(text.replace('Coins owned: ', ''))
                           cy.log(`Coins owned after selling: ${coinsOwnedAfter}`);

                           const coinsAvailable = coinsOwnedBefore - coinsSold

                           //assert "Coins owned" has decremented by the quantity provided
                           expect(coinsOwnedAfter).to.equal(coinsAvailable);
                     });             
               });
         });
      }
   }

} export default vite

import vite from '../support/vite';

let viteSite = new vite;
let coinType = 'CoinC'; //change parameter by coin type - can be CoinA, CoinB, CoinC, CoinD (CoinD might get error since it increments by large amount)

describe('This is to test the frontend of Vite app.', () => {

    before(() => {
      cy.clearCookies();
    })
    beforeEach(() => {
      cy.restoreLocalStorage();
    })
    afterEach(() => {
      cy.saveLocalStorage()
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
  })

    it('1. assert that there is a $100 USD balance in the beginning', () => {
      cy.visit('/');
      viteSite.acccountBal();
    });
    it('2. assert that there are four coin options available', () => {
      viteSite.checkCoins();
    });
    it('3. assert that CoinB is incrementing by one dollar over time', () => {
      viteSite.checkCoinB();
    });
    it('4. assert "Coins owned" has incremented by three quantity', () => {
      viteSite.buyCoins(coinType); 
    });
    it('5. assert that the "Market value" correctly reflects the cost per coin', () => {
      viteSite.checkMarketValue(coinType);
    });
    it('6. assert "Coins owned" has decremented by one quantity', () => {
      viteSite.sellCoins(coinType);
    });
  })
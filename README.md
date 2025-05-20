# Automated frontend test scripts for Vite app using Cypress and backend test scripts for Express API Server using SuperWSTest

Sample test automation for the Vite app

# 📝 Project Overview
This repository is for automating certain test acceptance criteria in the frontend app (Vite) and backend app (Express API Server).
 
# 🚀 Get Started
Clone the repository: https://github.com/eleingraces/vite.git
 
📜 Install/Run dependencies: 
  - **npm install --save-dev cypress**
  - **npm install concurrently --save-dev** (this allows the server and frontend server to run in parallel)
  - **node server.js** (this is to start the server for frontend testing)
  - **npm run start** (this is to run on local machine for frontend testing)

Run End to End FrontEnd test (via headless mode): **npm cypress:run:headless**

Run End to End FrontEnd test (via headed mode): **npm cypress:run:headed**

Run End to End BackEnd test: **npm test**
 
# 📙 Test Coverage
End to End FRONTEND test that includes:
- on load of the front end
  - assert that there is a $100 USD balance in the beginning
  - assert that there are four coin options available
  - assert that CoinB is incrementing by one dollar over time
- after buying three coins
  - assert "Coins owned" has incremented by three quantity
  - assert that the "Market value" correctly reflects the cost per coin
- after selling one coin
  - assert "Coins owned" has decremented by one quantity
 
 End to End BACKEND test that includes:
- when testing the endpoints
  - test for a successful response payload from the `purchase-coin` endpoint after a buy order is placed
- when testing the websocket
  - test that each message received matches the expected message payload shape
  - test that CoinB incremements by one dollar with each message over a period of time
  - test that `inventory.<coinId>.amountOwned` correctly reflects your owned inventory following a `purchase-coin` execution
 
# ✏️ Relevant Notes
**cypress/e2e/front-end.cy.js** -> this is the test file for the frontend end-to-end testing

**cypress/support/vite.js** -> this is the test file where page objects are stored; all the functions used to test the frontend of vite app

**superwstest/back-end.test.js** -> this is the test file for the backend testing

**start.js** -> this is a clone of server.js but used for backend testing

**wsSchema.js** -> for schema validation

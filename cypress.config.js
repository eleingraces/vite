import { defineConfig } from "cypress";
// require('cypress-xpath');

export default defineConfig({
  video: true,
  screenshotOnRunFailure: true, //screenshots on failure
  e2e: {
    watchForFileChanges: false,
    testIsolation: false,
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
/**
 * Module dependencies.
 */
const dotenv = require('dotenv');
const app = require('../server/app');
const fetch = require('node-fetch');
const mockAllowlist = ['http://allowed-origin.com'];
import cron from 'node-cron';
jest.mock('../server/app', () => {
  const originalModule = jest.requireActual('../server/app');
  return {
    __esModule: true,
    ...originalModule,
    allowlist: mockAllowlist, 
  };
});
jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));
// describe('CORS Options Delegate Middleware', () => {
//   test('corsOptionsDelegate should allow requests from allowed origins', async () => {
//     const origin = 'https://predev.agent-ux.rise.apps.aifa/';

//     const response = await fetch('https://predev.agentlogic.rise.apps.aifa/', {
//       method: 'GET',
//       headers: { 'Origin': origin },
//     });

//     const headers = Object.fromEntries(response.headers.entries());
//     console.log(headers['access-control-allow-origin'],"headers['access-control-allow-origin']")
//     expect(headers['access-control-allow-origin']).toBe(origin);
//     expect(headers['access-control-allow-credentials']).toBe('true');
//   });
 

// });
 /**
  * Testing dotenv.
  */
 test('test dotenv', () => {
   expect(dotenv).not.toBeUndefined();
   expect(dotenv).not.toBeNull();
   expect(dotenv).not.toBe(null);
 });
 test('TEST CRON', () => {
  cron.schedule.mockImplementation(async (frequency, callback) => await callback());
});

 /**
  * Testing app.
  */
 test('test app', () => {
   expect(app).not.toBeUndefined();
   expect(app).not.toBeNull();
   expect(app).not.toBe(null);
 
   
   expect(app.use).not.toBe(null);
   expect(app.use).not.toBeUndefined();
   expect(app.use).not.toBeNull();
 
   expect(app.all).not.toBe(null);
   expect(app.all).not.toBeUndefined();
   expect(app.all).not.toBeNull();
 });
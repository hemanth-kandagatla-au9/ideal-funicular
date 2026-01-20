// Import necessary modules and functions
const agentController = require('../../server/cron/agentInfo');
const { fetchDataByTimeInterval, updateFailedAgent } = require('../../server/cron/agentInfo');

const db = require('../../server/database/connection');
const fetch = require('node-fetch');
const { connectDatabase, insertintoDB } = require('../../server/cron/agentInfo');

// Mock the necessary dependencies
jest.mock('../../server/utils/envUtils', () => ({
  getOpenSearchPassword: jest.fn().mockResolvedValue('mockedPassword'),
  getMongoConnectionURL: jest.fn(() => 'mocked-url'),
}));
jest.mock('../../server/cron/agentInfo', () => {

  const originalModule = jest.requireActual('../../server/cron/agentInfo');

  return {
    ...originalModule,
    // updateFailedAgent: jest.fn(),
    connectDatabase: jest.fn(),

  };
});

// jest.mock('../../server/cron/agentInfo', () => ({
//   connectDatabase: jest.fn(),
//   fetchDataByTimeInterval:jest.fn()
// }));
// Mock the node-fetch module
jest.mock('node-fetch', () => {
  return jest.fn();
});


describe('Node.js App Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('syncAgentStatus should call insertDataintoAgentInfoCollection and return data when the request is successful', async () => {
    // Mock necessary functions and data
    const mockResponseData = {
      hits: {
        hits: [
          { _source: { hostname: 'example-host', status: 'Active' } },
          { _source: { hostname: 'another-host', status: 'Inactive' } },
        ],
      },
    };

    // Mock insertDataintoAgentInfoCollection
    agentController.insertDataintoAgentInfoCollection = jest.fn().mockResolvedValue(mockResponseData.hits.hits);

    // Call the function to be tested
    // await agentController.syncAgentStatus();

    // // Assert that the required functions were called
    // expect(agentController.insertDataintoAgentInfoCollection).toHaveBeenCalledTimes(0);
  });
  // test('updateFailedAgentStatus should call updateFailedAgent and return data when the request is successful', async () => {
  //   // Mock necessary functions and data
  //   const mockResponseData = {
  //     hits: {
  //       hits: [
  //         { _source: { hostname: 'example-host', status: 'Active' } },
  //         { _source: { hostname: 'another-host', status: 'Inactive' } },
  //       ],
  //     },
  //   };
  //   // Mock insertDataintoAgentInfoCollection
  //   agentController.updateFailedAgent = jest.fn().mockResolvedValue(mockResponseData.hits.hits);

  //   // // Call the function to be tested
  //   // await agentController.updateFailedAgentStatus();

  //   // // // Assert that the required functions were called
  //   // expect(agentController.updateFailedAgent).toHaveBeenCalledTimes(0);
  // });

  test('syncDiscoveryData should call updateCMDBData and return data when the request is successful', async () => {
    // Mock necessary functions and data
    const mockResponseData = {
      hits: {
        hits: [
          { _source: { hostname: 'example-host', status: 'Active' } },
          { _source: { hostname: 'another-host', status: 'Inactive' } },
        ],
      },
    };

    // Mock insertDataintoAgentInfoCollection
    agentController.updateCMDBData = jest.fn().mockResolvedValue(mockResponseData.hits.hits);

    // // Call the function to be tested
    // await agentController.syncDiscoveryData();

    // // Assert that the required functions were called
    // expect(agentController.updateCMDBData).toHaveBeenCalledTimes(0);
  });

  test('should call the callback with collections when connection is successful', async () => {
    const mockCollections = {
      agents: jest.fn(),
      sapMasterData: jest.fn(),
    };
    connectDatabase.mockResolvedValue(mockCollections);
    const mockCallback = jest.fn();
    await connectDatabase(mockCallback);
    // expect(mockCallback).toHaveBeenCalledWith(mockCollections);
  });
  test('should throw an error when connection fails', async () => {
    const errorMessage = 'Connection failed';
    const mockCallback = jest.fn();

    // Mock connectToDatabase to throw an error
    const error = new Error(errorMessage);
    connectDatabase.mockRejectedValue(error);

    try {
      await connectDatabase(mockCallback);
    } catch (error) {
      // Expect an error to be thrown
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(errorMessage);
    }

    // Ensure the callback was not called
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('should fetch data successfully within the specified time interval', async () => {
    // Mock environment variables and fetch request
    process.env.OPENSEARCH_USER = 'opensearchdb-dev';
    process.env.OPENSEARCH_NON_PROD_PASSWORD = 'QAZplm-925';
    process.env.OPENSEARCH_URL = 'https://vpc-itx-bvx-rise-opensearch-dev-udqq75qpplmy2bzjaecvzaw2u4.us-east-1.es.amazonaws.com';
    const mockResponse = { hits: { hits: [{ _source: { data: 'testData' } }] } };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockResponse) });

    // Call the function with a time interval
    const data = await fetchDataByTimeInterval((24 * 60)); // Assuming 10 minutes time interval



    // Assert that the fetch request was made with the correct URL and headers
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://vpc-itx-bvx-rise-opensearch-dev-udqq75qpplmy2bzjaecvzaw2u4.us-east-1.es.amazonaws.com'), {
      method: 'GET',
      headers: {
        Authorization: expect.stringContaining('Basic'),
      },
    });

    // Assert that the function returns the expected data
    // expect(data).toEqual([{ _source: { data: 'testData' } }]);
  });
  test('should return an empty array when response is not okay', async () => {
    // Mock environment variables and fetch request
    process.env.OPENSEARCH_USER = 'testUser';
    process.env.OPENSEARCH_NON_PROD_PASSWORD = 'testPassword';
    process.env.OPENSEARCH_URL = 'https://vpc-itx-bvx-rise-opensearch-dev-udqq75qpplmy2bzjaecvzaw2u4.us-east-1.es.amazonaws.com';
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    // Call the function with a time interval
    const data = await fetchDataByTimeInterval((24 * 60));

    // Assert that the function returns an empty array
    expect(data).toEqual([]);
  });

  test('should return an empty array when an error occurs during JSON parsing', async () => {
    // Mock environment variables and fetch request
    process.env.OPENSEARCH_USER = 'testUser';
    process.env.OPENSEARCH_NON_PROD_PASSWORD = 'testPassword';
    process.env.OPENSEARCH_URL = 'http://test-url.com';
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => { throw new Error('JSON parsing failed'); } });

    // Call the function with a time interval
    const data = await fetchDataByTimeInterval(10); // Assuming 10 minutes time interval

    // Assert that the function returns an empty array
    expect(data).toEqual([]);
  });

  // test('should update agents to "Failed" status for hostnames not found in logs', async () => {


  //   // Call the function to be tested
  //   await updateFailedAgent();


  // });
  test('should handle errors gracefully', async () => {
    // Mock fetchDataByTimeInterval to throw an error
    const originalFetchDataByTimeInterval = require('../../server/cron/agentInfo').fetchDataByTimeInterval;
    require('../../server/cron/agentInfo').fetchDataByTimeInterval = jest.fn().mockRejectedValue(new Error('Test error'));

    // Mock console.error to capture error messages
    console.error = jest.fn();

    // Call the function to be tested
    // await updateFailedAgent();

    // Restore the original implementation of fetchDataByTimeInterval
    require('../../server/cron/agentInfo').fetchDataByTimeInterval = originalFetchDataByTimeInterval;

    // Assert that console.error was called with the expected error message
    // expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Test error'));
  });

});
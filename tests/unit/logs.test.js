// Unit tests for GET /api/logs endpoint
const request = require("supertest");
const createApp = require("../../src/app/app");
const logsService = require("../../src/services/log.service");

// Mock the logs service so we don't need a real database
jest.mock("../../src/services/log.service");

// Create the app instance for testing
const app = createApp();

describe("GET /api/logs", () => {
  // This runs before each test to reset mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

 // Test 1: Should return logs successfully when database works
  it("should return 200 and array of logs when successful", async () => {
    // Mock data - fake logs to return
    const now = new Date();
    const mockLogs = [
      {
        _id: "123",
        level: "info",
        message: "Test log 1",
        timestamp: now,
      },
      {
        _id: "456",
        level: "error",
        message: "Test log 2",
        timestamp: now,
      },
    ];

    // Tell the mock to return our fake logs
    logsService.getAllLogs.mockResolvedValue(mockLogs);

    // Send GET request to /api/logs
    const response = await request(app).get("/api/logs");

    // Check the response
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].level).toBe("info");
    expect(response.body[0].message).toBe("Test log 1");
    expect(response.body[1].level).toBe("error");
    expect(response.body[1].message).toBe("Test log 2");
    expect(logsService.getAllLogs).toHaveBeenCalledTimes(1);
  });

  // Test 2: Should return error when database fails
  it("should return 500 and error message when service fails", async () => {
    // Tell the mock to throw an error
    logsService.getAllLogs.mockRejectedValue(
      new Error("Database connection failed")
    );

    // Send GET request to /api/logs
    const response = await request(app).get("/api/logs");

    // Check the error response
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("message");
    expect(response.body.id).toBe("LOGS_FETCH_ERROR");
    expect(response.body.message).toBe("Failed to fetch logs");
  });

  // Test 3: Should return empty array when no logs exist
  it("should return 200 and empty array when no logs exist", async () => {
    // Tell the mock to return empty array
    logsService.getAllLogs.mockResolvedValue([]);

    // Send GET request to /api/logs
    const response = await request(app).get("/api/logs");

    // Check the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

// Logs service unit tests
// Tests for log creation and retrieval: createLog, getAllLogs
// Validates field requirements, data types, and optional field handling
// Mocks logs repository for isolated service layer testing

// Mock the logs repository to avoid database calls during tests
jest.mock("../../src/app/repositories/logs_repository");

// Import the service being tested
const logsService = require("../../src/app/services/log_service");
// Import mocked dependencies for setup and verification
const logsRepository = require("../../src/app/repositories/logs_repository");
// Import error classes to verify proper error handling
const { ValidationError } = require("../../src/errors/validation_error");

describe("Logs Service", () => {
  // Reset all mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createLog", () => {
    // Tests for log creation with validation
    // Required fields: level (info|warn|error|debug), message, timestamp
    // Optional fields: method, url, statusCode, responseTime
    // Test 1: Verify log creation with valid required fields only
    it("should create a log successfully with valid data", async () => {
      // Arrange: Prepare test data with all required fields
      const logData = {
        level: "info",
        message: "Test log message",
        timestamp: new Date(),
      };

      // Arrange: Prepare expected returned data with database ID
      const savedLog = {
        _id: "log123",
        level: "info",
        message: "Test log message",
        timestamp: new Date(),
      };

      // Arrange: Mock repository to return saved log object
      logsRepository.createLog.mockResolvedValue(savedLog);

      // Act: Call the service method with test data
      const result = await logsService.createLog(logData);

      // Assert: Verify repository was called with log data
      expect(logsRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: "info",
          message: "Test log message",
        })
      );
      // Assert: Verify the result matches the expected saved log
      expect(result).toEqual(
        expect.objectContaining({
          _id: "log123",
          level: "info",
          message: "Test log message",
        })
      );
    });

    // Test 2: Verify level field is required
    // Ensures validation fails when level is missing
    it("should throw ValidationError when level is missing", async () => {
      // Arrange: Create log data without required level field
      const logData = {
        message: "Test log message",
        timestamp: new Date(),
      };

      // Act & Assert: Verify that missing level throws ValidationError
      await expect(logsService.createLog(logData)).rejects.toThrow(
        ValidationError
      );

      // Assert: Verify the error message indicates the missing field
      await expect(logsService.createLog(logData)).rejects.toThrow(
        "Field 'level' is required and must be a string"
      );
    });

    // Test 3: Verify message field is required
    // Ensures validation fails when message is missing
    it("should throw ValidationError when message is missing", async () => {
      // Arrange: Create log data without required message field
      const logData = {
        level: "info",
        timestamp: new Date(),
      };

      // Act & Assert: Verify that missing message throws ValidationError
      await expect(logsService.createLog(logData)).rejects.toThrow(
        ValidationError
      );

      // Assert: Verify the error message indicates the missing field
      await expect(logsService.createLog(logData)).rejects.toThrow(
        "Field 'message' is required and must be a string"
      );
    });

    // Test 4: Verify level must be a valid enum value
    // Ensures only predefined log levels are accepted
    it("should throw ValidationError when level is invalid", async () => {
      // Arrange: Create log data with invalid level value
      const logData = {
        level: "invalid_level",
        message: "Test log message",
        timestamp: new Date(),
      };

      // Act & Assert: Verify that invalid level throws ValidationError
      await expect(logsService.createLog(logData)).rejects.toThrow(
        ValidationError
      );

      // Assert: Verify the error message lists valid options
      await expect(logsService.createLog(logData)).rejects.toThrow(
        "Field 'level' must be one of: info, warn, error, debug"
      );
    });

    // Test 5: Verify timestamp must be a valid date
    // Ensures timestamp field contains proper date values
    it("should throw ValidationError when timestamp is invalid", async () => {
      // Arrange: Create log data with invalid timestamp format
      const logData = {
        level: "info",
        message: "Test log message",
        timestamp: "invalid-date",
      };

      // Act & Assert: Verify that invalid timestamp throws ValidationError
      await expect(logsService.createLog(logData)).rejects.toThrow(
        ValidationError
      );
    });

    // Test 6: Verify optional fields are accepted and stored
    // Ensures optional HTTP request metadata fields are preserved
    it("should create log with all optional fields", async () => {
      // Arrange: Create log data with all fields including optional ones
      const logData = {
        level: "error",
        message: "API error occurred",
        timestamp: new Date(),
        method: "GET",
        url: "/api/users",
        statusCode: 500,
        responseTime: 150,
      };

      // Arrange: Expected data after creation with all fields
      const savedLog = {
        _id: "log456",
        level: "error",
        message: "API error occurred",
        timestamp: new Date(),
        method: "GET",
        url: "/api/users",
        statusCode: 500,
        responseTime: 150,
      };

      // Arrange: Mock repository to return saved log with all fields
      logsRepository.createLog.mockResolvedValue(savedLog);

      // Act: Call the service method with complete data
      const result = await logsService.createLog(logData);

      // Assert: Verify repository was called with all fields
      expect(logsRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: "error",
          message: "API error occurred",
          method: "GET",
          url: "/api/users",
          statusCode: 500,
          responseTime: 150,
        })
      );
      // Assert: Verify optional fields are preserved in result
      expect(result.method).toBe("GET");
      expect(result.statusCode).toBe(500);
    });
  });

  describe("getAllLogs", () => {
    // Tests for retrieving all logs from repository
    // Validates empty array handling and timestamp sorting
    // Test 7: Verify logs are retrieved in expected order
    it("should return all logs", async () => {
      // Arrange: Create test logs array with multiple entries
      const logs = [
        {
          _id: "log1",
          level: "info",
          message: "Log 1",
          timestamp: new Date(),
        },
        {
          _id: "log2",
          level: "error",
          message: "Log 2",
          timestamp: new Date(),
        },
      ];

      // Arrange: Mock repository to return all logs
      logsRepository.findAllLogs.mockResolvedValue(logs);

      // Act: Call the service method to retrieve all logs
      const result = await logsService.getAllLogs();

      // Assert: Verify repository was called
      expect(logsRepository.findAllLogs).toHaveBeenCalled();
      // Assert: Verify correct number of logs returned
      expect(result).toHaveLength(2);
      // Assert: Verify log data is preserved correctly
      expect(result[0].level).toBe("info");
      expect(result[1].level).toBe("error");
    });

    // Test 8: Verify empty log list is handled correctly
    // Ensures no errors occur when no logs exist in database
    it("should return empty array when no logs exist", async () => {
      // Arrange: Mock repository to return empty array
      logsRepository.findAllLogs.mockResolvedValue([]);

      // Act: Call the service method when no logs exist
      const result = await logsService.getAllLogs();

      // Assert: Verify empty array is returned
      expect(result).toEqual([]);
      // Assert: Verify result is an array type
      expect(Array.isArray(result)).toBe(true);
    });

    // Test 9: Verify logs are sorted by timestamp
    // Ensures newest logs are returned first for relevance
    it("should sort logs by timestamp newest first", async () => {
      // Arrange: Create logs with different timestamps
      const now = new Date();
      const earlier = new Date(now.getTime() - 1000);
      const latest = new Date(now.getTime() + 1000);

      // Arrange: Create test logs in mixed timestamp order
      const logs = [
        {
          _id: "log1",
          level: "info",
          message: "Latest log",
          timestamp: latest,
        },
        {
          _id: "log2",
          level: "error",
          message: "Earlier log",
          timestamp: earlier,
        },
      ];

      // Arrange: Mock repository to return logs array
      logsRepository.findAllLogs.mockResolvedValue(logs);

      // Act: Call the service method to retrieve all logs
      const result = await logsService.getAllLogs();

      // Assert: Verify newest log is returned first
      expect(result[0].timestamp).toEqual(latest);
      // Assert: Verify older log is returned second
      expect(result[1].timestamp).toEqual(earlier);
    });
  });
});

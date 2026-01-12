// Costs service unit tests
// Tests for all service methods: createCost, getMonthlyReport, getUserTotalCosts
// Mocks repository and external service calls for isolated testing
// Uses Jest testing framework with mock functions for dependencies

// Mock the costs repository to avoid database calls during tests
jest.mock("../../src/app/repositories/costs_repository");
// Mock the users client to avoid inter-service calls during tests
jest.mock("../../src/clients/users_client");

// Import the service being tested
const costsService = require("../../src/app/services/costs_service");
// Import mocked dependencies for setup and verification
const costsRepository = require("../../src/app/repositories/costs_repository");
const usersClient = require("../../src/clients/users_client");
// Import database model (for reference and validation)
const Cost = require("../../src/db/models/cost.model");
// Import error classes to verify proper error handling
const { ValidationError } = require("../../src/errors/validation_error");
const { NotFoundError } = require("../../src/errors/not_found_error");
const { ServiceError } = require("../../src/errors/service_error");

describe("Costs Service", () => {
  // Reset all mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCost", () => {
    // Test 1: Verify cost creation with valid input data
    // Mocks user existence check and repository save
    // Verifies that the service properly validates and persists data
    it("should create cost successfully with valid data", async () => {
      // Arrange: Prepare test data with all required fields
      const costData = {
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
      };

      // Arrange: Prepare expected returned data with database ID
      const savedCost = {
        _id: "507f1f77bcf86cd799439011",
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
        createdAt: new Date(),
      };

      // Arrange: Mock user existence check to return true
      usersClient.checkUserExists.mockResolvedValue(true);
      // Arrange: Mock repository to return saved cost object
      costsRepository.createCost.mockResolvedValue(savedCost);

      // Act: Call the service method with test data
      const result = await costsService.createCost(costData, "req-123");

      // Assert: Verify repository was called with correct parameters
      expect(costsRepository.createCost).toHaveBeenCalledWith({
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
      });
      // Assert: Verify the result matches the expected saved cost
      expect(result).toEqual(savedCost);
    });

    it("should throw ValidationError when description is missing", async () => {
      // Arrange: Create cost data without required description field
      const costData = {
        category: "food",
        userid: 1,
        sum: 50,
      };

      // Act & Assert: Verify that missing description throws ValidationError
      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    // Test 3: Verify null description is rejected
    // Ensures type checking is performed on required fields
    it("should throw ValidationError when description is not a string", async () => {
      // Arrange: Create cost data with null description (invalid type)
      const costData = {
        description: null,
        category: "food",
        userid: 1,
        sum: 50,
      };

      // Act & Assert: Verify that non-string description throws ValidationError
      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    // Test 4: Verify category field is required
    // Ensures validation fails when category is missing
    it("should throw ValidationError when category is missing", async () => {
      // Arrange: Create cost data without required category field
      const costData = {
        description: "Lunch",
        userid: 1,
        sum: 50,
      };

      // Act & Assert: Verify that missing category throws ValidationError
      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    // Test 5: Verify category must be a string
    // Ensures type validation is enforced on category field
    it("should throw ValidationError when category is not a string", async () => {
      // Arrange: Create cost data with null category (invalid type)
      const costData = {
        description: "Lunch",
        category: null,
        userid: 1,
        sum: 50,
      };

      // Act & Assert: Verify that non-string category throws ValidationError
      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    // Test 6: Verify userid field is required
    // Ensures validation fails when userid is missing
    it("should throw ValidationError when userid is missing", async () => {
      // Arrange: Create cost data without required userid field
      const costData = {
        description: "Lunch",
        category: "food",
        sum: 50,
      };

      // Act & Assert: Verify that missing userid throws ValidationError
      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    // Test 7: Verify userid must be a number
    // Ensures type validation is enforced on userid field
    it("should throw ValidationError when userid is not a number", async () => {
      // Arrange: Create cost data with string userid (invalid type)
      const costData = {
        description: "Lunch",
        category: "food",
        userid: "not-a-number",
        sum: 50,
      };

      // Act & Assert: Verify that non-number userid throws ValidationError
      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    // Test 8: Verify sum field is required
    // Ensures validation fails when sum is missing
    it("should throw ValidationError when sum is missing", async () => {
      // Arrange: Create cost data without required sum field
      const costData = {
        description: "Lunch",
        category: "food",
        userid: 1,
      };

      // Act & Assert: Verify that missing sum throws ValidationError
      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    // Test 9: Verify sum must be a number
    // Ensures type validation is enforced on sum field
    it("should throw ValidationError when sum is not a number", async () => {
      // Arrange: Create cost data with string sum (invalid type)
      const costData = {
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: "not-a-number",
      };

      // Act & Assert: Verify that non-number sum throws ValidationError
      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    // Test 10: Verify sum must be positive
    // Ensures cost amounts are positive numbers only
    it("should throw ValidationError when sum is zero or negative", async () => {
      // Arrange: Create cost data with zero sum (invalid amount)
      const costData = {
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 0,
      };

      // Act & Assert: Verify that zero/negative sum throws ValidationError
      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    // Test 11: Verify whitespace trimming on string fields
    // Ensures description and category are cleaned of leading/trailing spaces
    it("should trim whitespace from description and category", async () => {
      // Arrange: Create cost data with whitespace around strings
      const costData = {
        description: "  Lunch  ",
        category: "  food  ",
        userid: 1,
        sum: 50,
      };

      // Arrange: Expected data after trimming whitespace
      const savedCost = {
        _id: "507f1f77bcf86cd799439011",
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
        createdAt: new Date(),
      };

      // Arrange: Mock user and repository calls
      usersClient.checkUserExists.mockResolvedValue(true);
      costsRepository.createCost.mockResolvedValue(savedCost);

      // Act: Call service with data containing whitespace
      await costsService.createCost(costData, "req-123");

      // Assert: Verify repository was called with trimmed values
      expect(costsRepository.createCost).toHaveBeenCalledWith({
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
      });
    });
  });

  describe("getMonthlyReport", () => {
    // Tests for monthly cost report generation
    // Validates user existence, handles caching, and converts string parameters
    it("should throw NotFoundError when user does not exist", async () => {
      usersClient.checkUserExists.mockResolvedValue(false);

      await expect(
        costsService.getMonthlyReport({
          id: 999,
          year: 2025,
          month: 6,
        })
      ).rejects.toThrow(NotFoundError);

      await expect(
        costsService.getMonthlyReport({
          id: 999,
          year: 2025,
          month: 6,
        })
      ).rejects.toThrow("User with id 999 not found");

      expect(usersClient.checkUserExists).toHaveBeenCalledWith(999);
    });

    it("should throw ServiceError when users service is unavailable", async () => {
      const error = new Error("connect ECONNREFUSED");
      error.code = "ECONNREFUSED";
      usersClient.checkUserExists.mockRejectedValue(error);

      await expect(
        costsService.getMonthlyReport({
          id: 1,
          year: 2025,
          month: 6,
        })
      ).rejects.toThrow(ServiceError);
    });

    it("should return cached report when available and user exists", async () => {
      const mockCachedReport = {
        userid: 1,
        year: 2025,
        month: 1,
        costs: [
          {
            food: [
              { sum: 50, description: "lunch", day: 5 },
              { sum: 30, description: "snack", day: 10 },
            ],
            education: [],
            health: [],
            housing: [],
            sports: [],
          },
        ],
      };

      usersClient.checkUserExists.mockResolvedValue(true);
      costsRepository.getMonthlyReportFromCache.mockResolvedValue({
        costs: mockCachedReport.costs,
      });

      const result = await costsService.getMonthlyReport(
        {
          id: 1,
          year: 2025,
          month: 1,
        },
        "req-123"
      );

      expect(costsRepository.getMonthlyReportFromCache).toHaveBeenCalledWith(
        1,
        2025,
        1
      );
      expect(costsRepository.getCostsByMonthAggregation).not.toHaveBeenCalled();
      expect(result).toEqual({
        userid: 1,
        year: 2025,
        month: 1,
        costs: mockCachedReport.costs,
      });
    });

    it("should generate and cache report when not cached and user exists", async () => {
      const freshReport = [
        {
          food: [
            { sum: 100, description: "pizza", day: 3 },
            { sum: 50, description: "burger", day: 15 },
          ],
          education: [{ sum: 200, description: "book", day: 8 }],
          health: [],
          housing: [],
          sports: [],
        },
      ];

      usersClient.checkUserExists.mockResolvedValue(true);
      costsRepository.getMonthlyReportFromCache.mockResolvedValue(null);
      costsRepository.getCostsByMonthAggregation.mockResolvedValue(freshReport);
      costsRepository.cacheMonthlyReport.mockResolvedValue({
        costs: freshReport,
      });

      const result = await costsService.getMonthlyReport(
        {
          id: 2,
          year: 2024,
          month: 12,
        },
        "req-123"
      );

      expect(costsRepository.getCostsByMonthAggregation).toHaveBeenCalledWith(
        2,
        2024,
        12
      );
      expect(costsRepository.cacheMonthlyReport).toHaveBeenCalledWith(
        2,
        2024,
        12,
        freshReport
      );
      expect(result).toEqual({
        userid: 2,
        year: 2024,
        month: 12,
        costs: freshReport,
      });
    });

    it("should throw ValidationError when id is missing", async () => {
      await expect(
        costsService.getMonthlyReport(
          {
            year: 2025,
            month: 1,
          },
          "req-123"
        )
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when year is missing", async () => {
      await expect(
        costsService.getMonthlyReport(
          {
            id: 1,
            month: 1,
          },
          "req-123"
        )
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when month is missing", async () => {
      await expect(
        costsService.getMonthlyReport(
          {
            id: 1,
            year: 2025,
          },
          "req-123"
        )
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when year is invalid", async () => {
      await expect(
        costsService.getMonthlyReport(
          {
            id: 1,
            year: 1800,
            month: 1,
          },
          "req-123"
        )
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when month is out of range", async () => {
      await expect(
        costsService.getMonthlyReport(
          {
            id: 1,
            year: 2025,
            month: 13,
          },
          "req-123"
        )
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when month is zero", async () => {
      await expect(
        costsService.getMonthlyReport(
          {
            id: 1,
            year: 2025,
            month: 0,
          },
          "req-123"
        )
      ).rejects.toThrow(ValidationError);
    });

    it("should convert string parameters to numbers", async () => {
      const cachedData = [
        {
          food: [],
          education: [],
          health: [],
          housing: [],
          sports: [],
        },
      ];

      usersClient.checkUserExists.mockResolvedValue(true);
      costsRepository.getMonthlyReportFromCache.mockResolvedValue(null);
      costsRepository.getCostsByMonthAggregation.mockResolvedValue(cachedData);
      costsRepository.cacheMonthlyReport.mockResolvedValue({
        costs: cachedData,
      });

      const result = await costsService.getMonthlyReport(
        {
          id: "1",
          year: "2025",
          month: "6",
        },
        "req-123"
      );

      expect(costsRepository.getCostsByMonthAggregation).toHaveBeenCalledWith(
        1,
        2025,
        6
      );
      expect(result).toEqual({
        userid: 1,
        year: 2025,
        month: 6,
        costs: cachedData,
      });
    });
  });

  describe("getUserTotalCosts", () => {
    // Tests for calculating total costs for a specific user
    // Validates userId parameter and handles zero costs case
    it("should return total costs for a user", async () => {
      costsRepository.getCostsTotalByUserId.mockResolvedValue(1500);

      const result = await costsService.getUserTotalCosts(
        { userId: 1 },
        "req-123"
      );

      expect(costsRepository.getCostsTotalByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        userid: 1,
        total_costs: 1500,
      });
    });

    it("should return zero when user has no costs", async () => {
      costsRepository.getCostsTotalByUserId.mockResolvedValue(0);

      const result = await costsService.getUserTotalCosts(
        { userId: 5 },
        "req-123"
      );

      expect(result).toEqual({
        userid: 5,
        total_costs: 0,
      });
    });

    it("should throw ValidationError when userId is missing", async () => {
      await expect(
        costsService.getUserTotalCosts({}, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when userId is not a number", async () => {
      await expect(
        costsService.getUserTotalCosts({ userId: "not-a-number" }, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when userId is null", async () => {
      await expect(
        costsService.getUserTotalCosts({ userId: null }, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should convert string userId to number", async () => {
      costsRepository.getCostsTotalByUserId.mockResolvedValue(800);

      const result = await costsService.getUserTotalCosts(
        { userId: "2" },
        "req-123"
      );

      expect(costsRepository.getCostsTotalByUserId).toHaveBeenCalledWith(2);
      expect(result).toEqual({
        userid: 2,
        total_costs: 800,
      });
    });
  });
});

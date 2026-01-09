// Costs service tests
jest.mock("../../src/app/repositories/costs_repository");

const costsService = require("../../src/app/services/costs_service");
const costsRepository = require("../../src/app/repositories/costs_repository");
const Cost = require("../../src/db/models/cost.model");
const { ValidationError } = require("../../src/errors/validation_error");

describe("Costs Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCost", () => {
    it("should create cost successfully with valid data", async () => {
      const costData = {
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
      };

      const savedCost = {
        _id: "507f1f77bcf86cd799439011",
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
        createdAt: new Date(),
      };

      costsRepository.createCost.mockResolvedValue(savedCost);

      const result = await costsService.createCost(costData, "req-123");

      expect(costsRepository.createCost).toHaveBeenCalledWith({
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
      });
      expect(result).toEqual(savedCost);
    });

    it("should throw ValidationError when description is missing", async () => {
      const costData = {
        category: "food",
        userid: 1,
        sum: 50,
      };

      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when description is not a string", async () => {
      const costData = {
        description: null,
        category: "food",
        userid: 1,
        sum: 50,
      };

      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when category is missing", async () => {
      const costData = {
        description: "Lunch",
        userid: 1,
        sum: 50,
      };

      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when category is not a string", async () => {
      const costData = {
        description: "Lunch",
        category: null,
        userid: 1,
        sum: 50,
      };

      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when userid is missing", async () => {
      const costData = {
        description: "Lunch",
        category: "food",
        sum: 50,
      };

      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when userid is not a number", async () => {
      const costData = {
        description: "Lunch",
        category: "food",
        userid: "not-a-number",
        sum: 50,
      };

      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when sum is missing", async () => {
      const costData = {
        description: "Lunch",
        category: "food",
        userid: 1,
      };

      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when sum is not a number", async () => {
      const costData = {
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: "not-a-number",
      };

      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when sum is zero or negative", async () => {
      const costData = {
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 0,
      };

      await expect(
        costsService.createCost(costData, "req-123")
      ).rejects.toThrow(ValidationError);
    });

    it("should trim whitespace from description and category", async () => {
      const costData = {
        description: "  Lunch  ",
        category: "  food  ",
        userid: 1,
        sum: 50,
      };

      const savedCost = {
        _id: "507f1f77bcf86cd799439011",
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
        createdAt: new Date(),
      };

      costsRepository.createCost.mockResolvedValue(savedCost);

      await costsService.createCost(costData, "req-123");

      expect(costsRepository.createCost).toHaveBeenCalledWith({
        description: "Lunch",
        category: "food",
        userid: 1,
        sum: 50,
      });
    });
  });

  describe("getMonthlyReport", () => {
    it("should return cached report when available", async () => {
      const cachedData = [
        { category: "food", total: 300 },
        { category: "transport", total: 120 },
      ];

      costsRepository.getMonthlyReportFromCache.mockResolvedValue({
        data: cachedData,
      });

      const result = await costsService.getMonthlyReport(
        {
          userid: 1,
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
      expect(result).toEqual(cachedData);
    });

    it("should generate and cache report when not cached", async () => {
      const freshReport = [
        { category: "food", total: 500 },
        { category: "fun", total: 200 },
      ];

      costsRepository.getMonthlyReportFromCache.mockResolvedValue(null);
      costsRepository.getCostsByMonthAggregation.mockResolvedValue(freshReport);
      costsRepository.cacheMonthlyReport.mockResolvedValue({
        data: freshReport,
      });

      const result = await costsService.getMonthlyReport(
        {
          userid: 2,
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
      expect(result).toEqual(freshReport);
    });

    it("should throw ValidationError when userid is missing", async () => {
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
            userid: 1,
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
            userid: 1,
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
            userid: 1,
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
            userid: 1,
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
            userid: 1,
            year: 2025,
            month: 0,
          },
          "req-123"
        )
      ).rejects.toThrow(ValidationError);
    });

    it("should convert string parameters to numbers", async () => {
      const cachedData = [];

      costsRepository.getMonthlyReportFromCache.mockResolvedValue(null);
      costsRepository.getCostsByMonthAggregation.mockResolvedValue(cachedData);
      costsRepository.cacheMonthlyReport.mockResolvedValue({
        data: cachedData,
      });

      await costsService.getMonthlyReport(
        {
          userid: "1",
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
    });
  });

  describe("getUserTotalCosts", () => {
    it("should return total costs for a user", async () => {
      costsRepository.getCostsTotalByUserId.mockResolvedValue(1500);

      const result = await costsService.getUserTotalCosts({ userId: 1 }, "req-123");

      expect(costsRepository.getCostsTotalByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        userid: 1,
        total_costs: 1500,
      });
    });

    it("should return zero when user has no costs", async () => {
      costsRepository.getCostsTotalByUserId.mockResolvedValue(0);

      const result = await costsService.getUserTotalCosts({ userId: 5 }, "req-123");

      expect(result).toEqual({
        userid: 5,
        total_costs: 0,
      });
    });

    it("should throw ValidationError when userId is missing", async () => {
      await expect(costsService.getUserTotalCosts({}, "req-123")).rejects.toThrow(
        ValidationError
      );
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

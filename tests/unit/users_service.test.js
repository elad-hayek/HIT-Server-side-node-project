// Users service tests
jest.mock("../../src/app/repositories/users_repository");
jest.mock("../../src/clients/costs_client");
jest.mock("../../src/logging");

const usersService = require("../../src/app/services/users_service");
const usersRepository = require("../../src/app/repositories/users_repository");
const costsClient = require("../../src/clients/costs_client");
const { ValidationError } = require("../../src/errors/validation_error");
const { NotFoundError } = require("../../src/errors/not_found_error");
const { DuplicateError } = require("../../src/errors/duplicate_error");
const { ServiceError } = require("../../src/errors/service_error");

describe("Users Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addUser", () => {
    it("should create user successfully with valid data", async () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: "1990-01-01",
      };

      const savedUser = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: new Date("1990-01-01"),
      };

      usersRepository.checkUserExists.mockResolvedValue(false);
      usersRepository.createUser.mockResolvedValue(savedUser);

      const result = await usersService.addUser(userData, "req-123");

      expect(usersRepository.checkUserExists).toHaveBeenCalledWith(1);
      expect(usersRepository.createUser).toHaveBeenCalledWith({
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: expect.any(Date),
      });
      expect(result).toEqual({
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: expect.any(Date),
      });
    });

    it("should throw ValidationError when id is missing", async () => {
      const userData = {
        first_name: "John",
        last_name: "Doe",
        birthday: "1990-01-01",
      };

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        ValidationError
      );

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        "Field 'id' is required and must be a number"
      );
    });

    it("should throw ValidationError when first_name is missing", async () => {
      const userData = {
        id: 1,
        last_name: "Doe",
        birthday: "1990-01-01",
      };

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        ValidationError
      );

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        "Field 'first_name' is required and must be a string"
      );
    });

    it("should throw ValidationError when last_name is missing", async () => {
      const userData = {
        id: 1,
        first_name: "John",
        birthday: "1990-01-01",
      };

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        ValidationError
      );

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        "Field 'last_name' is required and must be a string"
      );
    });

    it("should throw ValidationError when birthday is missing", async () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
      };

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        ValidationError
      );

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        "Field 'birthday' is required"
      );
    });

    it("should throw ValidationError when birthday is invalid", async () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: "invalid-date",
      };

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw DuplicateError when user id already exists", async () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: "1990-01-01",
      };

      usersRepository.checkUserExists.mockResolvedValue(true);

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        DuplicateError
      );
    });

    it("should throw DuplicateError when mongo returns duplicate key error", async () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: "1990-01-01",
      };

      usersRepository.checkUserExists.mockResolvedValue(false);

      const dbError = new Error("Duplicate key");
      dbError.code = 11000;
      usersRepository.createUser.mockRejectedValue(dbError);

      await expect(usersService.addUser(userData, "req-123")).rejects.toThrow(
        DuplicateError
      );
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          birthday: new Date("1990-01-01"),
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          birthday: new Date("1992-05-15"),
        },
      ];

      usersRepository.findAllUsers.mockResolvedValue(users);

      const result = await usersService.getAllUsers("req-123");

      expect(usersRepository.findAllUsers).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          birthday: new Date("1990-01-01"),
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          birthday: new Date("1992-05-15"),
        },
      ]);
    });

    it("should return empty array when no users exist", async () => {
      usersRepository.findAllUsers.mockResolvedValue([]);

      const result = await usersService.getAllUsers("req-123");

      expect(result).toEqual([]);
    });
  });

  describe("getUserById", () => {
    it("should return user with total_costs when costs-service responds", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: new Date("1990-01-01"),
      };

      usersRepository.findUserById.mockResolvedValue(user);
      costsClient.getTotalCosts.mockResolvedValue(150.5);

      const result = await usersService.getUserById("1", "req-123");

      expect(usersRepository.findUserById).toHaveBeenCalledWith(1);
      expect(costsClient.getTotalCosts).toHaveBeenCalledWith(1, "req-123");
      expect(result).toEqual({
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: new Date("1990-01-01"),
        total_costs: 150.5,
      });
    });

    it("should throw NotFoundError when user does not exist", async () => {
      usersRepository.findUserById.mockResolvedValue(null);

      await expect(usersService.getUserById("999", "req-123")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw ValidationError when id is not a number", async () => {
      await expect(usersService.getUserById("abc", "req-123")).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw ServiceError with 503 when costs-service is unavailable", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: new Date("1990-01-01"),
      };

      usersRepository.findUserById.mockResolvedValue(user);

      const error = new Error("connect ECONNREFUSED");
      error.code = "ECONNREFUSED";
      costsClient.getTotalCosts.mockRejectedValue(error);

      await expect(usersService.getUserById("1", "req-123")).rejects.toThrow(
        ServiceError
      );

      try {
        await usersService.getUserById("1", "req-123");
      } catch (err) {
        expect(err.status).toBe(503);
      }
    });

    it("should throw ServiceError with 503 when costs-service times out", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: new Date("1990-01-01"),
      };

      usersRepository.findUserById.mockResolvedValue(user);

      const error = new Error("timeout");
      error.code = "ETIMEDOUT";
      costsClient.getTotalCosts.mockRejectedValue(error);

      await expect(usersService.getUserById("1", "req-123")).rejects.toThrow(
        ServiceError
      );

      try {
        await usersService.getUserById("1", "req-123");
      } catch (err) {
        expect(err.status).toBe(503);
      }
    });

    it("should throw ServiceError with 502 when costs-service returns error response", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: new Date("1990-01-01"),
      };

      usersRepository.findUserById.mockResolvedValue(user);

      const error = new Error("Request failed");
      error.response = {
        status: 400,
        statusText: "Bad Request",
      };
      costsClient.getTotalCosts.mockRejectedValue(error);

      await expect(usersService.getUserById("1", "req-123")).rejects.toThrow(
        ServiceError
      );

      try {
        await usersService.getUserById("1", "req-123");
      } catch (err) {
        expect(err.status).toBe(502);
      }
    });
  });
});

// Users controller tests
jest.mock("../../src/app/services/users_service");

const usersController = require("../../src/app/controllers/users_controller");
const usersService = require("../../src/app/services/users_service");
const { ValidationError } = require("../../src/errors/validation_error");
const { NotFoundError } = require("../../src/errors/not_found_error");
const { DuplicateError } = require("../../src/errors/duplicate_error");
const { ServiceError } = require("../../src/errors/service_error");

describe("Users Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      headers: {},
      id: "test-request-id",
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("POST /api/add", () => {
    it("should create a new user successfully", async () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: "1990-01-01",
      };

      req.body = userData;

      const expectedUser = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: new Date("1990-01-01"),
      };

      usersService.addUser.mockResolvedValue(expectedUser);

      await usersController.addUser(req, res, next);

      expect(usersService.addUser).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedUser);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 when required fields are missing", async () => {
      req.body = {
        id: 1,
        first_name: "John",
      };

      const validationError = new ValidationError(
        "Field 'last_name' is required and must be a string"
      );

      usersService.addUser.mockRejectedValue(validationError);

      await usersController.addUser(req, res, next);

      expect(next).toHaveBeenCalledWith(validationError);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 409 when user id already exists", async () => {
      req.body = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: "1990-01-01",
      };

      const duplicateError = new DuplicateError(
        "User with id 1 already exists"
      );

      usersService.addUser.mockRejectedValue(duplicateError);

      await usersController.addUser(req, res, next);

      expect(next).toHaveBeenCalledWith(duplicateError);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/users", () => {
    it("should return array of users", async () => {
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

      usersService.getAllUsers.mockResolvedValue(users);

      await usersController.getUsers(req, res, next);

      expect(usersService.getAllUsers).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return user with total_costs when costs-service responds", async () => {
      req.params.id = "1";

      const userWithCosts = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birthday: new Date("1990-01-01"),
        total_costs: 150.5,
      };

      usersService.getUserById.mockResolvedValue(userWithCosts);

      await usersController.getUserById(req, res, next);

      expect(usersService.getUserById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(userWithCosts);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 404 when user not found", async () => {
      req.params.id = "999";

      const notFoundError = new NotFoundError("User with id 999 not found");

      usersService.getUserById.mockRejectedValue(notFoundError);

      await usersController.getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(notFoundError);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 503 when costs-service is unavailable", async () => {
      req.params.id = "1";

      const serviceError = new ServiceError("Costs service unavailable", 503);

      usersService.getUserById.mockRejectedValue(serviceError);

      await usersController.getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(serviceError);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});

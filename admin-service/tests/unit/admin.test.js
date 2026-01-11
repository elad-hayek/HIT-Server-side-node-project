// Mock external dependencies
jest.mock("../../src/clients/logging_client", () => ({
  logRequest: jest.fn(),
  logResponse: jest.fn(),
  logCustom: jest.fn(),
}));

// Mock the project members repository
jest.mock("../../src/app/repositories/project_members_repository", () => ({
  getAllProjectMembers: jest.fn(),
}));

const projectMembersRepository = require("../../src/app/repositories/project_members_repository");
const adminService = require("../../src/app/services/admin_service");

describe("Admin Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTeamMembers", () => {
    test("should return all team members from database", async () => {
      const mockMembers = [
        {
          first_name: "Alice",
          last_name: "Johnson",
        },
        {
          first_name: "Bob",
          last_name: "Smith",
        },
      ];

      projectMembersRepository.getAllProjectMembers.mockResolvedValue(
        mockMembers
      );

      const result = await adminService.getTeamMembers();

      expect(result).toEqual(mockMembers);
      expect(projectMembersRepository.getAllProjectMembers).toHaveBeenCalled();
    });

    test("should return empty array when no team members exist", async () => {
      projectMembersRepository.getAllProjectMembers.mockResolvedValue([]);

      const result = await adminService.getTeamMembers();

      expect(result).toEqual([]);
    });

    test("should throw error when repository fails", async () => {
      const error = new Error("Database error");
      projectMembersRepository.getAllProjectMembers.mockRejectedValue(error);
      await expect(adminService.getTeamMembers()).rejects.toThrow(
        "Database error"
      );
    });
  });
});

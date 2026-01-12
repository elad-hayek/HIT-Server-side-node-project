// Mock external dependencies
jest.mock("../../src/clients/logging_client", () => ({
  logRequest: jest.fn(),
  logResponse: jest.fn(),
  logCustom: jest.fn(),
}));

const adminService = require("../../src/app/services/admin_service");

describe("Admin Service", () => {
  describe("getTeamMembers", () => {
    test("should return hardcoded team members", () => {
      const result = adminService.getTeamMembers();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("first_name");
      expect(result[0]).toHaveProperty("last_name");
    });

    test("should return team members with correct structure", () => {
      const result = adminService.getTeamMembers();

      result.forEach((member) => {
        expect(member).toEqual({
          first_name: expect.any(String),
          last_name: expect.any(String),
        });
      });
    });

    test("should return consistent team members on multiple calls", () => {
      const result1 = adminService.getTeamMembers();
      const result2 = adminService.getTeamMembers();

      expect(result1).toEqual(result2);
    });
  });
});

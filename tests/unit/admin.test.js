const request = require('supertest');

// Mock external dependencies
jest.mock('../../src/clients/logging_client', () => ({
  logRequest: jest.fn(),
  logResponse: jest.fn(),
  logCustom: jest.fn()
}));

const createApp = require('../../src/app/app');

describe('Admin Endpoints', () => {
  let app;

  beforeAll(() => {
    // Set up test environment variables
    process.env.TEAM_MEMBER_1_FIRST_NAME = 'moshe';
    process.env.TEAM_MEMBER_1_LAST_NAME = 'israeli';
    process.env.TEAM_MEMBER_2_FIRST_NAME = 'john';
    process.env.TEAM_MEMBER_2_LAST_NAME = 'doe';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    app = createApp();
  });

  describe('GET /api/about', () => {
    test('should return team members with first_name and last_name', async () => {
      const response = await request(app)
        .get('/api/about')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('first_name');
      expect(response.body[0]).toHaveProperty('last_name');
    });

    test('should return only first_name and last_name properties', async () => {
      const response = await request(app)
        .get('/api/about')
        .expect(200);

      const firstMember = response.body[0];
      const keys = Object.keys(firstMember);

      expect(keys).toContain('first_name');
      expect(keys).toContain('last_name');
      expect(keys.length).toBe(2);
    });

    test('should return correct team member data from environment', async () => {
      const response = await request(app)
        .get('/api/about')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            first_name: expect.any(String),
            last_name: expect.any(String)
          })
        ])
      );
    });
  });
});

describe('Admin Service', () => {
  test('should load team members from config', () => {
    const config = require('../../src/config');

    expect(config.teamMembers).toBeInstanceOf(Array);
    expect(config.teamMembers.length).toBeGreaterThan(0);

    config.teamMembers.forEach(member => {
      expect(member).toHaveProperty('first_name');
      expect(member).toHaveProperty('last_name');
      expect(typeof member.first_name).toBe('string');
      expect(typeof member.last_name).toBe('string');
    });
  });
});

const Cost = require("../../../models/cost.model");
const MonthlyReport = require("../../../models/monthlyReport.model");
const { getMonthlyReport } = require("../../services/costs.service");

jest.mock("../../../models/cost.model");
jest.mock("../../../models/monthlyReport.model");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Costs Service - getMonthlyReport", () => {
  it("should return aggregated monthly report", async () => {
    const fakeReport = [
      { category: "food", total: 300 },
      { category: "transport", total: 120 },
    ];

    MonthlyReport.findOne.mockResolvedValue(null);
    Cost.aggregate.mockResolvedValue(fakeReport);

    const result = await getMonthlyReport({
      userid: 1,
      year: 2025,
      month: 1,
    });

    expect(Cost.aggregate).toHaveBeenCalled();
    expect(result).toEqual(fakeReport);
  });
});

it("should call aggregate with match and group stages", async () => {
  Cost.aggregate.mockResolvedValue([]);

  await getMonthlyReport({
    userid: 2,
    year: 2024,
    month: 12,
  });

  MonthlyReport.findOne.mockResolvedValue(null);
  const pipeline = Cost.aggregate.mock.calls[0][0];

  const hasMatchStage = pipeline.some((stage) => stage.$match);
  const hasGroupStage = pipeline.some((stage) => stage.$group);

  expect(hasMatchStage).toBe(true);
  expect(hasGroupStage).toBe(true);
});

it("should return cached report without calling aggregate", async () => {
  const cachedData = [
    { category: "food", total: 500 },
    { category: "fun", total: 200 },
  ];

  MonthlyReport.findOne.mockResolvedValue({
    data: cachedData,
  });

  const result = await getMonthlyReport({
    userid: 1,
    year: 2025,
    month: 2,
  });

  expect(MonthlyReport.findOne).toHaveBeenCalled();
  expect(Cost.aggregate).not.toHaveBeenCalled();
  expect(result).toEqual(cachedData);
});

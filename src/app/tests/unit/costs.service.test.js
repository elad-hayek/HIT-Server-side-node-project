const Cost = require("../../../models/cost.model");
const { getMonthlyReport } = require("../../services/costs.service");

jest.mock("../../../models/cost.model");

describe("Costs Service - getMonthlyReport", () => {
  it("should return aggregated monthly report", async () => {
    const fakeReport = [
      { category: "food", total: 300 },
      { category: "transport", total: 120 },
    ];

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

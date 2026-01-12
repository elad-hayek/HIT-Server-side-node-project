// Cost categories configuration module
// Defines all valid expense categories for the costs tracking system
// Used for validation and categorization of user expenses throughout the application

/**
 * COST_CATEGORIES object
 * Enumeration of all allowed cost categories in the system
 * Each category represents a type of expense that can be tracked
 */
const COST_CATEGORIES = {
  // Food and dining expenses (groceries, restaurants, delivery)
  FOOD: "food",
  // Healthcare and medical expenses (doctor visits, prescriptions, insurance)
  HEALTH: "health",
  // Housing and residential expenses (rent, mortgage, utilities)
  HOUSING: "housing",
  // Sports and fitness expenses (gym, equipment, classes)
  SPORTS: "sports",
  // Education and learning expenses (courses, books, training)
  EDUCATION: "education",
};

/**
 * VALID_CATEGORIES array
 * Extracted list of all valid category values
 * Used for validation and filtering in cost operations
 * Automatically generated from COST_CATEGORIES object values
 */
const VALID_CATEGORIES = Object.values(COST_CATEGORIES);

// Export configuration constants for use throughout costs-service
module.exports = {
  COST_CATEGORIES,
  VALID_CATEGORIES,
};

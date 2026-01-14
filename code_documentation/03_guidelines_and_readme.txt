================================================================================
PROJECT README - QUICK START GUIDE
================================================================================

PROJECT: HIT Server-Side Node Project
Description: Microservices architecture with 4 independent Node.js services

================================================================================
PREREQUISITES
================================================================================

Before running the project, ensure you have:

1. Node.js (v14 or higher)
   Download from: https://nodejs.org/

2. MongoDB (Local Instance)
   Download from: https://www.mongodb.com/try/download/community
   
   After installation, start MongoDB:
   - Windows: mongod (run from MongoDB bin directory)
   - macOS: brew services start mongodb-community
   - Linux: sudo systemctl start mongod

3. npm (comes with Node.js)
   Verify: npm --version

================================================================================
QUICK START - RUN LOCALLY
================================================================================

Step 1: Clone or Navigate to Project
  cd C:\projects\hit-courses\HIT-Server-side-node-project

Step 2: Install Dependencies for All Services

  Open terminal and run these commands (from project root):

  cd admin-service
  npm install
  cd ../costs-service
  npm install
  cd ../logs-service
  npm install
  cd ../users-service
  npm install

Step 3: Create .env Files (Optional - Uses Defaults)

  Each service can work with default environment variables, but you can
  create a .env file in each service directory if needed:

  admin-service/.env:
    NODE_ENV=development
    PORT=2000
    LOG_LEVEL=info
    MONGO_URI=mongodb://localhost:27017/app

  users-service/.env:
    NODE_ENV=development
    PORT=3000
    LOG_LEVEL=info
    MONGO_URI=mongodb://localhost:27017/app
    COSTS_SERVICE_URL=http://localhost:4000/api
    LOGGING_SERVICE_URL=http://localhost:5000/api

  costs-service/.env:
    NODE_ENV=development
    PORT=4000
    LOG_LEVEL=info
    MONGO_URI=mongodb://localhost:27017/app
    USERS_SERVICE_URL=http://localhost:3000/api
    LOGGING_SERVICE_URL=http://localhost:5000/api

  logs-service/.env:
    NODE_ENV=development
    PORT=5000
    LOG_LEVEL=info
    MONGO_URI=mongodb://localhost:27017/app

Step 4: Start Each Service in Separate Terminal Windows

  Terminal 1 - Admin Service:
    cd admin-service
    npm run dev
    (Runs on http://localhost:2000)

  Terminal 2 - Users Service:
    cd users-service
    npm run dev
    (Runs on http://localhost:3000)

  Terminal 3 - Costs Service:
    cd costs-service
    npm run dev
    (Runs on http://localhost:4000)

  Terminal 4 - Logs Service:
    cd logs-service
    npm run dev
    (Runs on http://localhost:5000)

Step 5: Verify Services are Running

  Check each terminal for messages like:
    "Server running on port [PORT]"
    "MongoDB connected"

  If you see these messages, all services are running correctly!

================================================================================
RUNNING TESTS
================================================================================

To run unit tests for a service:

  cd [service-name]
  npm test

To run tests in watch mode:

  cd [service-name]
  npm run test:watch

================================================================================
PROJECT STRUCTURE
================================================================================

HIT-Server-side-node-project/
├── admin-service/               (Port 2000)
│   ├── src/
│   │   ├── app/
│   │   ├── clients/
│   │   ├── config/
│   │   ├── db/
│   │   ├── errors/
│   │   └── logging/
│   ├── tests/
│   ├── server.js
│   └── package.json
│
├── users-service/               (Port 3000)
│   ├── src/
│   ├── tests/
│   ├── server.js
│   └── package.json
│
├── costs-service/               (Port 4000)
│   ├── src/
│   ├── tests/
│   ├── server.js
│   └── package.json
│
└── logs-service/                (Port 5000)
    ├── src/
    ├── tests/
    ├── server.js
    └── package.json

================================================================================
SERVICES OVERVIEW
================================================================================

Admin Service (Port 2000)
  Purpose: Team information and administration
  API: GET /api/about - Returns team members

Users Service (Port 3000)
  Purpose: User profile management
  API Endpoints:
    POST /api/add - Create new user
    GET /api/users - Get all users
    GET /api/users/:id - Get user by ID
    GET /api/exists/:id - Check if user exists

Costs Service (Port 4000)
  Purpose: Expense tracking and reporting
  API Endpoints:
    POST /api/add - Create cost entry
    GET /api/report - Get monthly cost report
    GET /api/user-total - Get user total costs

Logs Service (Port 5000)
  Purpose: Centralized logging
  API Endpoints:
    GET /api/logs - Get all logs
    POST /api/logs - Create log entry

================================================================================
ENVIRONMENT VARIABLES REFERENCE
================================================================================

Available environment variables for each service:

Common Variables (All Services):
  NODE_ENV           Application environment (development, production)
                     Default: development
  
  PORT                HTTP server port
                     Defaults: admin=2000, users=3000, costs=4000, logs=5000
  
  LOG_LEVEL           Pino logger level (debug, info, warn, error)
                     Default: info
                     Use 'debug' for detailed logging during development
                     Use 'error' for production to reduce log volume
  
  MONGO_URI           MongoDB connection string
                     Default: mongodb://localhost:27017/app

Service-Specific Variables:

  Admin Service:
    LOGGING_SERVICE_URL        URL to logs-service API
                               Default: http://localhost:5000/api
    LOGGING_SERVICE_TIMEOUT    Timeout in ms for logging calls
                               Default: 3000

  Users Service:
    COSTS_SERVICE_URL          URL to costs-service API
    LOGGING_SERVICE_URL        URL to logs-service API
    COSTS_SERVICE_TIMEOUT      Timeout in ms
    LOGGING_SERVICE_TIMEOUT    Timeout in ms

  Costs Service:
    USERS_SERVICE_URL          URL to users-service API
    LOGGING_SERVICE_URL        URL to logs-service API
    USERS_SERVICE_TIMEOUT      Timeout in ms
    LOGGING_SERVICE_TIMEOUT    Timeout in ms

  Logs Service:
    LOGGING_SERVICE_TIMEOUT    Timeout in ms for internal operations

================================================================================
LOGGING CONFIGURATION
================================================================================

Each service uses Pino for structured logging with configurable levels.

Log Levels (in order of verbosity):
  debug    - Detailed debugging information (most verbose)
  info     - General informational messages (default)
  warn     - Warning messages for potential issues
  error    - Error messages and stack traces (most restrictive)

Set LOG_LEVEL environment variable to control what gets logged:

  Production:  LOG_LEVEL=error   (minimal logs, best performance)
  Development: LOG_LEVEL=debug   (detailed logs for troubleshooting)
  Default:     LOG_LEVEL=info    (balanced for general use)

Example - Run with debug logging:
  LOG_LEVEL=debug npm run dev

Log Output Destinations:
  - stdout (console) - Real-time viewing
  - Logging Service - Centralized log storage in MongoDB
  - logs-service stores all logs for future querying

Issue: "MongoDB connection error"
  Solution: Make sure MongoDB is running (mongod command)
  Check: mongod --version

Issue: "Port already in use"
  Solution: Another service is using that port
  Kill process: netstat -ano | findstr :[PORT] (Windows)
  Or change PORT in .env file

Issue: "Cannot find module"
  Solution: Run npm install in the service directory
  Make sure node_modules folder exists

Issue: "Service timeout on inter-service calls"
  Solution: Check if other services are running on expected ports
  Verify all 4 services are started

Issue: "npm ERR! code ENOENT"
  Solution: Make sure you're in the correct service directory
  Run: cd [service-name] first

================================================================================
STOPPING SERVICES
================================================================================

To stop all services:
  1. Press Ctrl+C in each terminal window
  2. All services will shut down gracefully

To stop MongoDB:
  - Windows: Press Ctrl+C in MongoDB terminal
  - macOS: brew services stop mongodb-community
  - Linux: sudo systemctl stop mongod

================================================================================
ADDITIONAL INFORMATION
================================================================================

Dependencies Used:
  - Express.js: Web framework
  - Mongoose: MongoDB ORM
  - Axios: HTTP client for inter-service communication
  - Pino: Structured logging
  - dotenv: Environment variables
  - Jest: Testing framework

For full code documentation, refer to the service-specific code files:
  - admin-service_code.txt
  - users-service_code.txt
  - costs-service_code.txt
  - logs-service_code.txt


================================================================================
GETTING STARTED FOR NEW DEVELOPERS
════════════════════════════════════════════════════════════════════════════

Step 1: Clone Repository
  git clone [>>> REPOSITORY_URL <<<]
  cd HIT-Server-side-node-project

Step 2: Install Dependencies
  cd admin-service && npm install
  cd ../costs-service && npm install
  cd ../logs-service && npm install
  cd ../users-service && npm install

Step 3: Configure Environment
  Create .env file in each service directory:
  NODE_ENV=development
  PORT=[service-port]
  MONGO_URI=mongodb://localhost:27017/app
  [Other configuration variables]

Step 4: Start Services
  From each service directory, run:
  npm run dev

Step 5: Verify Installation
  All services should start without errors
  Check logs for "Server running on port [port]" messages

Step 6: Test API Endpoints
  Use Postman or similar tool to test endpoints
  Refer to API documentation in each service README


TROUBLESHOOTING COMMON ISSUES
════════════════════════════════════════════════════════════════════════════

Issue: MongoDB Connection Error
  Solution: Ensure MongoDB is running and connection string is correct
  
Issue: Port Already in Use
  Solution: Change PORT in .env or stop other services using the port
  
Issue: Module Not Found
  Solution: Run npm install and verify node_modules exists
  
Issue: Tests Failing
  Solution: Ensure MongoDB is running for integration tests
  
Issue: Service Timeout on Inter-Service Calls
  Solution: Check if other services are running and accessible
  
[>>> PLACEHOLDER: ADD MORE TROUBLESHOOTING SCENARIOS <<<]


ADDITIONAL RESOURCES
════════════════════════════════════════════════════════════════════════════

Documentation:
  - Node.js: https://nodejs.org/en/docs/
  - Express: https://expressjs.com/
  - Mongoose: https://mongoosejs.com/
  - Jest: https://jestjs.io/
  - Pino: https://getpino.io/

Project References:
  - Git Workflow: [>>> PLACEHOLDER: INSERT LINK <<<]
  - API Documentation: [>>> PLACEHOLDER: INSERT LINK <<<]
  - Team Wiki: [>>> PLACEHOLDER: INSERT LINK <<<]
  - Issue Tracker: [>>> PLACEHOLDER: INSERT LINK <<<]

================================================================================

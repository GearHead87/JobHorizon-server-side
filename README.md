### JobHorizon Server

This repository contains the server-side code for the JobHorizon job-seeking website project. JobHorizon is a platform where users can post job listings, search for positions, and apply seamlessly.

### Technologies Used

- **Node.js:** Server-side JavaScript runtime environment.
  
- **Express.js:** Web application framework for Node.js, used for handling HTTP requests.
  
- **MongoDB:** NoSQL database used for storing job listings and user data.
  
- **JWT (JSON Web Tokens):** Authentication method used to securely authenticate and authorize users.
  
- **Mongoose:** MongoDB object modeling tool for Node.js, used for data manipulation and validation.
  
- **Tanstack/react-query:** Used for data fetching and caching on the client-side, enhancing performance.
  
- **bcryptjs:** Library used for hashing passwords to enhance security.
  
- **dotenv:** Module used to load environment variables from a .env file into process.env.
  
- **cors:** Middleware used to enable Cross-Origin Resource Sharing (CORS).
  

### JobHorizon Server - Endpoints

#### Authentication

- **POST /jwt**
  - Description: Generates a JWT token upon successful authentication.

- **POST /logout**
  - Description: Clears the JWT token upon logout.

#### Jobs

- **GET /jobs**
  - Description: Retrieves all job listings.
  - Query Parameters:
    - `search`: Search job listings by title.

- **GET /job/:id**
  - Description: Retrieves details of a specific job listing by ID.

- **PUT /job/:id**
  - Description: Updates a job listing by ID (requires authentication).

- **DELETE /job/:id**
  - Description: Deletes a job listing by ID (requires authentication).

- **POST /add-job**
  - Description: Adds a new job listing (requires authentication).

#### User Specific

- **GET /my-jobs/:email**
  - Description: Retrieves job listings added by a specific user (requires authentication).

- **GET /applied-jobs/:email**
  - Description: Retrieves job listings a specific user has applied for (requires authentication).
  - Query Parameters:
    - `filter`: Filter applied jobs by category.

- **POST /apply-job**
  - Description: Allows a user to apply for a job listing (requires authentication).

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
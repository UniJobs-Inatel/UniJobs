# Job Publication API Documentation

## Base URL

`/api/job/publications`

## Endpoints

### 1. Search Job Publications

- **URL**: `/api/job/publications/search`
- **Method**: `GET`
- **Description**: Searches for job publications based on various criteria.
- **Query Parameters**:
  - `location` (string): Job location.
  - `type` (string): Job type (e.g., Full-Time).
  - `skills` (string): Comma-separated list of skill IDs.
  - `minSalary` (number): Minimum salary.
  - `maxSalary` (number): Maximum salary.
  - `mode` (string): Mode (e.g., Remote).
  - `weeklyHours` (number): Weekly working hours.
  - `fieldId` (number): Field ID.
  - `limit` (number): Number of results per page (default: 10).
  - `offset` (number): Pagination offset (default: 0).
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "publications": [
          {
            "id": 1,
            "status": "approved",
            "publication_request_date": "2024-10-26T00:00:00.000Z",
            "job": {
              "id": 1,
              "title": "Software Engineer"
            },
            "company": {
              "id": 1,
              "name": "Company Name"
            },
            "college": {
              "id": 1,
              "name": "College Name"
            }
          }
        ],
        "total": 1,
        "pageCount": 1,
        "currentPage": 1
      }
      ```

  - **Errors**:
    - **400 Bad Request**: If invalid query parameters are provided.

### 2. Get Job Publications by Company

- **URL**: `/api/job/publications/company`
- **Method**: `GET`
- **Description**: Retrieves all job publications for the company associated with the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "status": "approved",
          "job": {
            "id": 1,
            "title": "Software Engineer"
          },
          "college": {
            "id": 1,
            "name": "College Name"
          },
          "company": {
            "id": 1,
            "name": "Company Name"
          }
        }
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: If the JWT token is invalid or missing.

### 3. Get Job Publications by College

- **URL**: `/api/job/publications/college`
- **Method**: `GET`
- **Description**: Retrieves all job publications for the college associated with the authenticated user's company.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "status": "approved",
          "job": {
            "id": 1,
            "title": "Software Engineer"
          },
          "company": {
            "id": 1,
            "name": "Company Name"
          }
        }
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: If the JWT token is invalid or missing.

### 4. Get Job Publications by User's College

- **URL**: `/api/job/publications/student`
- **Method**: `GET`
- **Description**: Retrieves all job publications available to the student's college.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "status": "approved",
          "job": {
            "id": 1,
            "title": "Software Engineer"
          },
          "company": {
            "id": 1,
            "name": "Company Name"
          },
          "college": {
            "id": 1,
            "name": "College Name"
          }
        }
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: If the JWT token is invalid or missing.

### 5. Update Job Publication

- **URL**: `/api/job/publications/:id`
- **Method**: `PUT`
- **Description**: Updates the status of a job publication.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `id` (number): The ID of the job publication.
- **Request Body**:

    ```json
    {
      "status": "approved"
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "status": "approved",
        "publication_request_date": "2024-10-26T00:00:00.000Z",
        "publication_date": "2024-10-27T00:00:00.000Z",
        "job": {
          "id": 1,
          "title": "Software Engineer"
        },
        "company": {
          "id": 1,
          "name": "Company Name"
        },
        "college": {
          "id": 1,
          "name": "College Name"
        }
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Publicação de vaga não encontrada."
    - **401 Unauthorized**: "Apenas a faculdade pode aprovar ou reprovar uma publicação."
    - **400 Bad Request**: "Transição de status inválida de X para Y."

### 6. Get Colleges Where Job is Not Published

- **URL**: `/api/job/colleges/:jobId`
- **Method**: `GET`
- **Description**: Retrieves a list of colleges where the specified job has not been published.
- **Path Parameters**:
  - `jobId` (number): The ID of the job.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "name": "College A",
          "location": "City A"
        },
        {
          "id": 2,
          "name": "College B",
          "location": "City B"
        }
      ]
      ```

  - **Errors**:
    - **404 Not Found**: "Vaga não encontrada."
    - **401 Unauthorized**: If the JWT token is invalid or missing.

## Notes

- All endpoints require JWT authentication through the `JwtAuthGuard`.
- Some endpoints, such as updating job publication status, require specific roles or ownership to be modified.
- The `Authorization` header must be provided with a valid JWT token for every request.

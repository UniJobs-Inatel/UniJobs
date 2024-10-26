# Job API Documentation

## Base URL

`/api/job`

## Endpoints

### 1. Create a Job

- **URL**: `/api/job`
- **Method**: `POST`
- **Description**: Creates a new job posting.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "company_id": 1,
      "field_id": 2,
      "title": "Software Engineer",
      "description": "Develop and maintain web applications.",
      "location": "Remote",
      "type": "Full-Time",
      "salary": 5000,
      "mode": "Remote",
      "weekly_hours": 40
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "title": "Software Engineer",
        "description": "Develop and maintain web applications.",
        "location": "Remote",
        "type": "Full-Time",
        "salary": 5000,
        "mode": "Remote",
        "weekly_hours": 40,
        "company": {
          "id": 1,
          "name": "Company Name"
        },
        "field": {
          "id": 2,
          "field": "IT"
        }
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Empresa não encontrada."
    - **404 Not Found**: "Área de atuação não encontrada."
    - **401 Unauthorized**: "Usuário não autorizado a criar uma vaga para esta empresa."

### 2. Get All Jobs

- **URL**: `/api/job`
- **Method**: `GET`
- **Description**: Retrieves a list of all job postings.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "title": "Software Engineer",
          "location": "Remote",
          "type": "Full-Time",
          "company": {
            "id": 1,
            "name": "Company Name"
          },
          "field": {
            "id": 2,
            "field": "IT"
          }
        }
      ]
      ```

### 3. Search Jobs

- **URL**: `/api/job/search`
- **Method**: `GET`
- **Description**: Searches for jobs based on various criteria.
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
        "jobs": [
          {
            "id": 1,
            "title": "Software Engineer",
            "location": "Remote",
            "type": "Full-Time",
            "company": {
              "id": 1,
              "name": "Company Name"
            },
            "field": {
              "id": 2,
              "field": "IT"
            }
          }
        ],
        "total": 1,
        "pageCount": 1,
        "currentPage": 1
      }
      ```

### 4. Get Job by ID

- **URL**: `/api/job/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a job by its ID.
- **Path Parameters**:
  - `id` (number) - The ID of the job.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "title": "Software Engineer",
        "description": "Develop and maintain web applications.",
        "location": "Remote",
        "type": "Full-Time",
        "salary": 5000,
        "mode": "Remote",
        "weekly_hours": 40,
        "company": {
          "id": 1,
          "name": "Company Name"
        },
        "field": {
          "id": 2,
          "field": "IT"
        }
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Vaga não encontrada."

### 5. Update Job

- **URL**: `/api/job/:id`
- **Method**: `PUT`
- **Description**: Updates a job posting.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `id` (number) - The ID of the job.
- **Request Body**:

    ```json
    {
      "title": "Updated Job Title",
      "description": "Updated job description.",
      "field_id": 2,
      ...
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "title": "Updated Job Title",
        ...
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Vaga não encontrada."
    - **404 Not Found**: "Área de atuação não encontrada."
    - **401 Unauthorized**: "Usuário não autorizado a atualizar esta vaga."

### 6. Delete Job

- **URL**: `/api/job/:id`
- **Method**: `DELETE`
- **Description**: Deletes a job posting.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `id` (number) - The ID of the job.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **404 Not Found**: "Vaga não encontrada."
    - **401 Unauthorized**: "Usuário não autorizado a deletar esta vaga."

### 7. Publish Job

- **URL**: `/api/job/publish`
- **Method**: `POST`
- **Description**: Creates a job publication.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "job_id": 1,
      "company_id": 1,
      "college_id": 1
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "status": "pending",
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
      ```

  - **Errors**:
    - **404 Not Found**: "Vaga ou empresa não encontrada."
    - **401 Unauthorized**: "Usuário não autorizado a criar esta publicação."

## Notes

- All endpoints require JWT authentication through the `JwtAuthGuard`.
- For publishing and updating job publications, ensure the user has the appropriate permissions.
- The `Authorization` header must be provided with a valid JWT token for every request.

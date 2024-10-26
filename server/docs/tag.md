# Tags API Documentation

## Base URL

`/api/tags`

## Endpoints

### 1. Create a Tag (Admin Only)

- **URL**: `/api/tags`
- **Method**: `POST`
- **Description**: Creates a new tag.
- **Request Headers**:
  - `Authorization`: Bearer token with admin privileges.
- **Request Body**:

    ```json
    {
      "name": "JavaScript"
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "name": "JavaScript"
      }
      ```

  - **Errors**:
    - **400 Bad Request**: "Nome da tag não pode estar vazio."

### 2. Update a Tag (Admin Only)

- **URL**: `/api/tags/:id`
- **Method**: `PUT`
- **Description**: Updates the name of an existing tag.
- **Request Headers**:
  - `Authorization`: Bearer token with admin privileges.
- **Path Parameters**:
  - `id` (number) - The ID of the tag.
- **Request Body**:

    ```json
    {
      "name": "TypeScript"
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "name": "TypeScript"
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Tag não encontrada."
    - **400 Bad Request**: "Nome da tag não pode estar vazio."

### 3. Delete a Tag (Admin Only)

- **URL**: `/api/tags/:id`
- **Method**: `DELETE`
- **Description**: Deletes a tag by its ID.
- **Request Headers**:
  - `Authorization`: Bearer token with admin privileges.
- **Path Parameters**:
  - `id` (number) - The ID of the tag.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **404 Not Found**: "Tag não encontrada."

### 4. Get All Tags

- **URL**: `/api/tags`
- **Method**: `GET`
- **Description**: Retrieves a list of all tags.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "name": "JavaScript"
        },
        {
          "id": 2,
          "name": "Python"
        }
      ]
      ```

### 5. Get Tags by Student ID

- **URL**: `/api/tags/student/:studentId`
- **Method**: `GET`
- **Description**: Retrieves tags (proficiencies) associated with a specific student.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `studentId` (number) - The ID of the student.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "name": "JavaScript"
        },
        {
          "id": 2,
          "name": "TypeScript"
        }
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a acessar esta informação."

### 6. Get Tags by Job ID

- **URL**: `/api/tags/job/:jobId`
- **Method**: `GET`
- **Description**: Retrieves tags associated with a specific job.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `jobId` (number) - The ID of the job.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 3,
          "name": "React"
        },
        {
          "id": 4,
          "name": "NodeJS"
        }
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a acessar esta informação."

### 7. Create Student Proficiency

- **URL**: `/api/tags/student-proficiencies`
- **Method**: `POST`
- **Description**: Creates a proficiency tag for a student.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "studentId": 1,
      "tagId": 2
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "student": {
          "id": 1
        },
        "tag": {
          "id": 2,
          "name": "TypeScript"
        }
      }
      ```

  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a criar esta proficiência."

### 8. Get Student Proficiencies

- **URL**: `/api/tags/student-proficiencies/:studentId`
- **Method**: `GET`
- **Description**: Retrieves a list of proficiency tags associated with a student.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `studentId` (number) - The ID of the student.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "tag": {
            "id": 2,
            "name": "TypeScript"
          }
        }
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a acessar estas proficiências."

### 9. Delete Student Proficiency

- **URL**: `/api/tags/student-proficiencies/:id`
- **Method**: `DELETE`
- **Description**: Deletes a student's proficiency tag.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `id` (number) - The ID of the student proficiency.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a deletar esta proficiência."

### 10. Create Job Tag

- **URL**: `/api/tags/job-tags`
- **Method**: `POST`
- **Description**: Creates a tag for a job.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "jobId": 1,
      "tagId": 2
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "job": {
          "id": 1
        },
        "tag": {
          "id": 2,
          "name": "TypeScript"
        }
      }
      ```

  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a criar esta tag de trabalho."

### 11. Get Job Tags

- **URL**: `/api/tags/job-tags/:jobId`
- **Method**: `GET`
- **Description**: Retrieves a list of tags associated with a job.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `jobId` (number) - The ID of the job.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "tag": {
            "id": 2,
            "name": "TypeScript"
          }
        }
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a acessar estas tags de trabalho."

### 12. Delete Job Tag

- **URL**: `/api/tags/job-tags/:id`
- **Method**: `DELETE`
- **Description**: Deletes a job's tag.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `id` (number) - The ID of the job tag.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a deletar esta tag de trabalho."

## Notes

- Some endpoints require admin privileges, such as creating, updating, and deleting tags.
- All other endpoints require JWT authentication through the `JwtAuthGuard`.
- The `Authorization` header must be provided with a valid JWT token for every request.
- Proper permissions are needed to manage tags for students or jobs.

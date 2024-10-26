# Student API Documentation

## Base URL

`/api/student`

## Endpoints

### 1. Create Student Profile

- **URL**: `/api/student/profile`
- **Method**: `POST`
- **Description**: Creates a student profile for the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "student": {
        "firstName": "John",
        "lastName": "Doe",
        "birthDate": "2000-01-01",
        "about": "Software engineering student."
      },
      "experiences": [
        {
          "title": "Intern",
          "company": "Tech Corp",
          "description": "Developed mobile applications.",
          "startDate": "2023-01-01",
          "endDate": "2023-06-01"
        }
      ],
      "proficiencies": [
        {
          "id": 1
        },
        {
          "id": 2
        }
      ]
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "about": "Software engineering student.",
        "user": {
          "id": 1,
          "email": "john@example.com"
        },
        "college": {
          "id": 1,
          "name": "Inatel"
        },
        "experiences": [
          {
            "id": 1,
            "title": "Intern",
            "company": "Tech Corp"
          }
        ],
        "proficiencies": [
          {
            "id": 1,
            "name": "JavaScript"
          }
        ]
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Usuário não encontrado."
    - **401 Unauthorized**: "Apenas usuários do tipo estudante podem criar perfis de estudante."

### 2. Update Student Profile

- **URL**: `/api/student/profile`
- **Method**: `PUT`
- **Description**: Updates the student profile of the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "student": {
        "about": "Updated description."
      },
      "experiences": [
        {
          "id": 1,
          "title": "Senior Intern",
          "company": "Tech Corp"
        }
      ],
      "proficiencies": [
        {
          "id": 3
        }
      ]
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "about": "Updated description.",
        ...
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Perfil de estudante não encontrado."
    - **401 Unauthorized**: "Usuário não autorizado a atualizar este perfil."

### 3. Get Student Profile

- **URL**: `/api/student/profile`
- **Method**: `GET`
- **Description**: Retrieves the student profile of the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "about": "Updated description.",
        ...
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Perfil de estudante não encontrado."

### 4. Create Experience

- **URL**: `/api/student/experience`
- **Method**: `POST`
- **Description**: Creates a new experience entry for a student.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "title": "Junior Developer",
      "company": "Tech Corp",
      "description": "Developed features for mobile apps.",
      "startDate": "2024-01-01"
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 2,
        "title": "Junior Developer",
        "company": "Tech Corp",
        "description": "Developed features for mobile apps."
      }
      ```

  - **Errors**:
    - **401 Unauthorized**: If the JWT token is invalid or missing.

### 5. Get All Experiences

- **URL**: `/api/student/experience`
- **Method**: `GET`
- **Description**: Retrieves all experience entries.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "title": "Intern",
          "company": "Tech Corp"
        },
        ...
      ]
      ```

### 6. Get Experience by ID

- **URL**: `/api/student/experience/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific experience entry by its ID.
- **Path Parameters**:
  - `id` (number) - The ID of the experience.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "title": "Intern",
        "company": "Tech Corp",
        ...
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Experiência não encontrada."

### 7. Update Experience

- **URL**: `/api/student/experience/:id`
- **Method**: `PUT`
- **Description**: Updates an existing experience entry.
- **Path Parameters**:
  - `id` (number) - The ID of the experience.
- **Request Body**:

    ```json
    {
      "title": "Senior Developer",
      "company": "Tech Corp",
      "description": "Lead mobile app development."
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "title": "Senior Developer",
        ...
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Experiência não encontrada."

### 8. Delete Experience

- **URL**: `/api/student/experience/:id`
- **Method**: `DELETE`
- **Description**: Deletes an experience entry.
- **Path Parameters**:
  - `id` (number) - The ID of the experience.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **404 Not Found**: "Experiência não encontrada."

### 9. Favorite a Job

- **URL**: `/api/student/favorite-job/:jobId`
- **Method**: `POST`
- **Description**: Adds a job publication to the student's list of favorites.
- **Path Parameters**:
  - `jobId` (number) - The ID of the job publication.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "jobPublication": {
          "id": 1,
          "title": "Software Engineer"
        }
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Vaga não encontrada."
    - **401 Unauthorized**: "Usuário não autorizado a favoritar esta vaga."

### 10. Unfavorite a Job

- **URL**: `/api/student/favorite-job/:jobId`
- **Method**: `DELETE`
- **Description**: Removes a job publication from the student's list of favorites.
- **Path Parameters**:
  - `jobId` (number) - The ID of the job publication.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **404 Not Found**: "Esta vaga não está nos favoritos."

### 11. Get Favorite Jobs

- **URL**: `/api/student/favorite-jobs`
- **Method**: `GET`
- **Description**: Retrieves the list of job publications favorited by the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "jobPublication": {
            "id": 1,
            "title": "Software Engineer"
          }
        },
        ...
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a acessar esta lista de favoritos."

## Notes

- All endpoints require JWT authentication through the `JwtAuthGuard`.
- The `Authorization` header must be provided with a valid JWT token for every request.
- The authenticated user must have appropriate permissions to create, update, or delete resources.

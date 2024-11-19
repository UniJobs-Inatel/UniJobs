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
        "first_name": "John",
        "last_name": "Doe",
        "cpf": "12345678900"
      },
      "experiences": [
        {
          "type": "professional",
          "description": "Developed mobile applications.",
          "company_name": "Tech Corp",
          "position": "Intern",
          "start_date": "2023-01-01",
          "end_date": "2023-06-01"
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
        "first_name": "John",
        "last_name": "Doe",
        "cpf": "12345678900",
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
            "type": "professional",
            "position": "Intern",
            "company_name": "Tech Corp"
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

---

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
        "first_name": "John",
        "last_name": "Smith",
        "cpf": "98765432100"
      },
      "experiences": [
        {
          "id": 1,
          "type": "professional",
          "description": "Lead mobile app development.",
          "company_name": "Tech Corp",
          "position": "Senior Developer",
          "start_date": "2023-01-01",
          "end_date": "2023-12-31"
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
        "first_name": "John",
        "last_name": "Smith",
        "cpf": "98765432100",
        ...
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Perfil de estudante não encontrado."
    - **401 Unauthorized**: "Usuário não autorizado a atualizar este perfil."

---

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
        "first_name": "John",
        "last_name": "Smith",
        "cpf": "98765432100",
        ...
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Perfil de estudante não encontrado."

---

### 4. Create Experience

- **URL**: `/api/student/experience`
- **Method**: `POST`
- **Description**: Creates a new experience entry for a student.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "type": "academic",
      "description": "Research project on AI.",
      "company_name": "University Lab",
      "position": "Researcher",
      "start_date": "2022-01-01",
      "end_date": "2023-01-01"
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 2,
        "type": "academic",
        "description": "Research project on AI.",
        "company_name": "University Lab",
        "position": "Researcher"
      }
      ```

  - **Errors**:
    - **401 Unauthorized**: If the JWT token is invalid or missing.

---

### 5. Get All Experiences

- **URL**: `/api/student/experience`
- **Method**: `GET`
- **Description**: Retrieves all experience entries for the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "type": "professional",
          "description": "Developed mobile applications.",
          "company_name": "Tech Corp",
          "position": "Intern"
        },
        ...
      ]
      ```

---

### 6. Update Experience

- **URL**: `/api/student/experience/:id`
- **Method**: `PUT`
- **Description**: Updates an existing experience entry.
- **Path Parameters**:
  - `id` (number) - The ID of the experience.
- **Request Body**:

    ```json
    {
      "type": "professional",
      "description": "Managed a development team.",
      "company_name": "Tech Corp",
      "position": "Team Lead",
      "start_date": "2023-01-01",
      "end_date": null
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "type": "professional",
        "description": "Managed a development team.",
        ...
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Experiência não encontrada."

---

### 7. Delete Experience

- **URL**: `/api/student/experience/:id`
- **Method**: `DELETE`
- **Description**: Deletes an experience entry.
- **Path Parameters**:
  - `id` (number) - The ID of the experience.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **404 Not Found**: "Experiência não encontrada."

---

### 8. Favorite a Job

- **URL**: `/api/student/favorite-job/:jobPublicationId`
- **Method**: `POST`
- **Description**: Adds a job publication to the student's list of favorites.
- **Path Parameters**:
  - `jobPublicationId` (number) - The ID of the job publication.
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

---

### 9. Unfavorite a Job

- **URL**: `/api/student/favorite-job/:jobPublicationId`
- **Method**: `DELETE`
- **Description**: Removes a job publication from the student's list of favorites.
- **Path Parameters**:
  - `jobPublicationId` (number) - The ID of the job publication.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **404 Not Found**: "Esta vaga não está nos favoritos."

---

### 10. Get Favorite Jobs

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

---

## Notes

- All endpoints require JWT authentication through the `JwtAuthGuard`.
- For profile creation, experiences, and proficiencies are optional fields but highly recommended for a complete profile.

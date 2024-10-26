# College API Documentation

## Base URL

`/api/college`

## Endpoints

### 1. Create a College

- **URL**: `/api/college`
- **Method**: `POST`
- **Description**: Creates a new college associated with a company.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "company_id": 1
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "company": {
          "id": 1,
          "name": "Company Name"
        }
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Empresa não encontrada."
    - **401 Unauthorized**: "O usuário associado a esta empresa deve ser do tipo 'faculdade'."
    - **401 Unauthorized**: "Usuário não autorizado a realizar esta ação."

### 2. Create a Valid Email Domain

- **URL**: `/api/college/valid-email`
- **Method**: `POST`
- **Description**: Creates a new valid email domain for a college.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "domain": "example.edu",
      "college_id": 1
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "domain": "example.edu",
        "college": {
          "id": 1
        }
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Faculdade não encontrada."
    - **401 Unauthorized**: "Usuário não autorizado a realizar esta ação."

### 3. Delete a Valid Email Domain

- **URL**: `/api/college/valid-email/:id`
- **Method**: `DELETE`
- **Description**: Deletes a valid email domain by its ID.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `id` (number) - The ID of the valid email domain to delete.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **404 Not Found**: "E-mail válido não encontrado."
    - **401 Unauthorized**: "Usuário não autorizado a realizar esta ação."

### 4. List Valid Email Domains for a College

- **URL**: `/api/college/valid-email/:college_id`
- **Method**: `GET`
- **Description**: Retrieves a list of valid email domains associated with a specific college.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `college_id` (number) - The ID of the college.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "domain": "example.edu",
          "college": {
            "id": 1
          }
        },
        {
          "id": 2,
          "domain": "another.edu",
          "college": {
            "id": 1
          }
        }
      ]
      ```

  - **Errors**:
    - **404 Not Found**: "Faculdade não encontrada."
    - **401 Unauthorized**: "Usuário não autorizado a realizar esta ação."

### 5. List All Valid Email Domains

- **URL**: `/api/college/valid-email/`
- **Method**: `GET`
- **Description**: Retrieves all valid email domains for colleges associated with the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "domain": "example.edu",
          "college": {
            "id": 1
          }
        },
        {
          "id": 2,
          "domain": "another.edu",
          "college": {
            "id": 2
          }
        }
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: "Usuário não autorizado a visualizar os e-mails."

## Notes

- All endpoints require JWT authentication through the `JwtAuthGuard`.
- The `Authorization` header must be provided with a valid JWT token for every request.
- The authenticated user must have appropriate permissions related to the `company` or `college` they are managing.

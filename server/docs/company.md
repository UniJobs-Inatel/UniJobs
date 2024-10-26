# Company API Documentation

## Base URL

`/api/company`

## Endpoints

### 1. Create a Company Profile

- **URL**: `/api/company/profile`
- **Method**: `POST`
- **Description**: Creates a new company profile for the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "name": "Company Name",
      "address": "123 Street, City, Country",
      "website": "https://company.com",
      "description": "Brief description of the company."
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "name": "Company Name",
        "address": "123 Street, City, Country",
        "website": "https://company.com",
        "description": "Brief description of the company.",
        "user": {
          "id": 1,
          "email": "user@example.com"
        }
      }
      ```

  - **Errors**:
    - **409 Conflict**: "O usuário já possui um perfil de empresa."
    - **404 Not Found**: "Usuário não encontrado."
    - **401 Unauthorized**: "Apenas usuários do tipo 'empresa' ou 'faculdade' podem criar um perfil de empresa."

### 2. Get Company Profile

- **URL**: `/api/company/profile/`
- **Method**: `GET`
- **Description**: Retrieves the company profile of the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "name": "Company Name",
        "address": "123 Street, City, Country",
        "website": "https://company.com",
        "description": "Brief description of the company.",
        "user": {
          "id": 1,
          "email": "user@example.com"
        }
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Perfil de empresa não encontrado."

### 3. Update Company Profile

- **URL**: `/api/company/profile/`
- **Method**: `PUT`
- **Description**: Updates the company profile for the authenticated user.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Request Body**:

    ```json
    {
      "name": "Updated Company Name",
      "address": "456 New Street, New City, Country",
      "website": "https://newcompany.com",
      "description": "Updated description of the company."
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "name": "Updated Company Name",
        "address": "456 New Street, New City, Country",
        "website": "https://newcompany.com",
        "description": "Updated description of the company.",
        "user": {
          "id": 1,
          "email": "user@example.com"
        }
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Perfil de empresa não encontrado."

## Notes

- All endpoints require JWT authentication through the `JwtAuthGuard`.
- The `Authorization` header must be provided with a valid JWT token for every request.
- The authenticated user must have a type of `company` or `college` to create a company profile.

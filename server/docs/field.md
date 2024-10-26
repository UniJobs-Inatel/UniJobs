# Field API Documentation

## Base URL

`/api/field`

## Endpoints

### 1. Get All Fields

- **URL**: `/api/field`
- **Method**: `GET`
- **Description**: Retrieves a list of all fields of expertise.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "field": "it"
        },
        {
          "id": 2,
          "field": "engineering"
        },
        {
          "id": 3,
          "field": "health"
        }
      ]
      ```

  - **Errors**:
    - **401 Unauthorized**: If the JWT token is invalid or missing.

### 2. Get Field by ID

- **URL**: `/api/field/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific field of expertise by its ID.
- **Request Headers**:
  - `Authorization`: Bearer token for authentication.
- **Path Parameters**:
  - `id` (number) - The ID of the field.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "field": "it"
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Área de atuação não encontrada."
    - **401 Unauthorized**: If the JWT token is invalid or missing.

### 3. Create a Field

- **URL**: `/api/field`
- **Method**: `POST`
- **Description**: Creates a new field of expertise. Only accessible by admin users.
- **Request Headers**:
  - `Authorization`: Bearer token with admin privileges.
- **Request Body**:

    ```json
    {
      "field": "new_field_name"
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 11,
        "field": "new_field_name"
      }
      ```

  - **Errors**:
    - **400 Bad Request**: "O nome da área de atuação não pode estar vazio."
    - **401 Unauthorized**: If the JWT token is invalid or the user lacks admin privileges.

## Notes

- The `GET` endpoints require JWT authentication with the `JwtAuthGuard`.
- The `POST` endpoint requires admin privileges using the `AdminGuard`.
- The `Authorization` header must be provided with a valid JWT token for every request.

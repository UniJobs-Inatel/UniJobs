# User API Documentation

## Base URL

`/api/user`

## Endpoints

### 1. Get All Users

- **URL**: `/api/user`
- **Method**: `GET`
- **Description**: Retrieves a list of all users.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      [
        {
          "id": 1,
          "email": "john@example.com",
          "firstName": "John",
          "lastName": "Doe",
          "type": "student"
        },
        ...
      ]
      ```

  - **Errors**:
    - **500 Internal Server Error**: "Erro ao buscar os usuários."

### 2. Create a User

- **URL**: `/api/user`
- **Method**: `POST`
- **Description**: Creates a new user.
- **Request Body**:

    ```json
    {
      "email": "john@example.com",
      "password": "password123",
      "firstName": "John",
      "lastName": "Doe",
      "type": "student"
    }
    ```

- **Response**:
  - **Status**: `201 Created`
  - **Body**:

      ```json
      {
        "id": 1,
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "type": "student"
      }
      ```

  - **Errors**:
    - **409 Conflict**: "O email já está registrado."
    - **500 Internal Server Error**: "Erro ao criar o usuário."

### 3. Update a User

- **URL**: `/api/user/:id`
- **Method**: `PUT`
- **Description**: Updates the details of an existing user.
- **Path Parameters**:
  - `id` (number) - The ID of the user to update.
- **Request Body**:

    ```json
    {
      "email": "john.new@example.com",
      "password": "newpassword123",
      "firstName": "John",
      "lastName": "Doe Updated"
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "email": "john.new@example.com",
        "firstName": "John",
        "lastName": "Doe Updated",
        "type": "student"
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Usuário com ID 1 não encontrado."
    - **500 Internal Server Error**: "Erro ao atualizar o usuário."

### 4. Delete a User

- **URL**: `/api/user/:id`
- **Method**: `DELETE`
- **Description**: Deletes a user by their ID.
- **Path Parameters**:
  - `id` (number) - The ID of the user to delete.
- **Response**:
  - **Status**: `204 No Content`
  - **Errors**:
    - **404 Not Found**: "Usuário com ID 1 não encontrado."
    - **500 Internal Server Error**: "Erro ao remover o usuário."

### 5. Get a User by ID

- **URL**: `/api/user/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a user by their ID.
- **Path Parameters**:
  - `id` (number) - The ID of the user.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:

      ```json
      {
        "id": 1,
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "type": "student"
      }
      ```

  - **Errors**:
    - **404 Not Found**: "Usuário com ID 1 não encontrado."
    - **500 Internal Server Error**: "Erro ao buscar o usuário."

## Notes

- This API allows basic user management, including creating, updating, deleting, and fetching user data.
- User passwords are hashed before being saved to ensure security.
- Use appropriate permissions and guards when exposing these endpoints in a production environment.

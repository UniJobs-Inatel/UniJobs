# API Documentation

## Overview

Welcome to the API documentation for UniJobs. This documentation provides detailed information about each module, including routes, request and response structures, and any necessary authentication details.

### Base URL

All endpoints are prefixed with the following base URL:

``` plaintext
/api
```

### Authentication

Most endpoints require authentication via JSON Web Tokens (JWT). To access these endpoints, include the `Authorization` header in your requests:

``` plaintext  
Authorization: Bearer <token>
```

### User Types

- **Student**: Users who are students and can manage their profiles, experiences, and job preferences.
- **Company**: Users representing companies, who can post job listings and manage applications.
- **College**: Users representing educational institutions that can manage job publications.
- **Admin**: Users with elevated permissions to manage various aspects of the system, including tags.

### Status Codes

- **200 OK**: The request was successful.
- **201 Created**: A new resource was successfully created.
- **204 No Content**: The request was successful, but there is no content to return.
- **400 Bad Request**: The request was invalid or missing required parameters.
- **401 Unauthorized**: Authentication failed or the user does not have permission.
- **404 Not Found**: The requested resource could not be found.
- **409 Conflict**: A resource with the provided parameters already exists.
- **500 Internal Server Error**: An unexpected error occurred on the server.

## Index of Modules

Below is an index of all modules with links to their detailed documentation:

1. [User Module](./docs/user)
   - Manage user accounts, including creating, updating, deleting, and retrieving user information.

2. [Student Module](./docs/student)
   - Manage student profiles, experiences, proficiencies, and favorite jobs.

3. [Company Module](./docs/company)
   - Manage company profiles and view job listings associated with the company.

4. [College Module](./docs/college)
   - Manage college profiles, valid email domains, and associated job publications.

5. [Job Module](./docs/job)
   - Create, update, search, and delete job listings, as well as manage job publications.

6. [Job Publication Module](./docs/job-publication)
   - Manage job publications, including creating, approving, and searching for published jobs.

7. [Field Module](./docs/field)
   - Manage fields of expertise that are associated with jobs and students.

8. [Tags Module](./docs/tags)
   - Manage tags that represent skills and proficiencies for students and jobs, including adding and removing tags.

## Getting Started

To start using the API, you will need to authenticate and obtain a JWT token. Use this token in the `Authorization` header for each subsequent request to access protected endpoints.

### Example Authentication Request

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}

**Response**:

```json
{
  "token": "your.jwt.token"
}
```

### Example Request with JWT Token

**GET** `/api/student`

**Request Headers**:

```plaintext
Authorization: Bearer your.jwt.token
```

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request. In case of an error, the response body will contain a message describing the error.

```json
{
  "statusCode": 400,
  "message": "Invalid input data",
  "error": "Bad Request"
}
```

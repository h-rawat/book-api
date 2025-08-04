# Book Management API

A secure RESTful API for managing a collection of books with user authentication, validation, email notifications, and Swagger documentation.

---

## Setup Instructions

### 1. Clone the Repository

```git clone <your-repo-url>```
```cd book-api```


### 2. Install Dependencies

```npm install```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following (adjust values as needed):

```
MONGO_URI=mongodb://localhost:27017/bookdb
JWT_SECRET=your_jwt_secret_here
```

```
For Gmail SMTP (example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_SERVICE=gmail
```

- For Gmail, generate an App Password in your Google Account security settings.

### 4. Start MongoDB

Make sure MongoDB is running locally, or update `MONGO_URI` if using a cloud MongoDB service like Atlas.

### 5. Run the Application
```npm start```

Or, if `start` script is not defined:
```node app.js```

### 6. Access the API and Documentation

- API endpoints: `http://localhost:3000/api/...`
- Swagger UI: `http://localhost:3000/api-docs`

### 7. Test the API

Use tools like Swagger UI, Postman, Insomnia, or cURL to interact with the API endpoints.

---

If you encounter issues, check your terminal for error messages and verify the `.env` configuration.

---

# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message"
}
```

---

## Authentication Endpoints

### 1. Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "company",
    "companyId": "507f1f77bcf86cd799439012",
    "companyCode": "COMP123"
  }
}
```

### 2. Get Profile
```
GET /auth/profile
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "employee",
  "phone": "1234567890",
  "address": "123 Main St",
  "companyId": "507f1f77bcf86cd799439012",
  "salaryStructure": {
    "basicSalary": 30000,
    "hra": 10000,
    "allowances": 5000,
    "grossSalary": 45000,
    "pfApplicable": true,
    "pfAmount": 3600,
    "esiApplicable": false,
    "esiAmount": 0
  }
}
```

### 3. Update Profile
```
PUT /auth/profile
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "9876543210",
  "address": "456 New Street",
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "ABCD0001234",
    "bankName": "Test Bank",
    "accountHolderName": "John Doe"
  }
}
```

### 4. Change Password
```
POST /auth/change-password
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## Admin Endpoints

### 1. Register Company
```
POST /admin/companies
Headers: Authorization: Bearer <token>
Role: admin
```

**Request Body:**
```json
{
  "name": "Test Company",
  "email": "company@test.com",
  "phone": "9876543210",
  "address": "Company Address",
  "gstNumber": "12ABCDE3456F7Z8",
  "password": "company123"
}
```

**Response:**
```json
{
  "message": "Company registered successfully",
  "company": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Test Company",
    "email": "company@test.com",
    "companyCode": "COMP123ABC"
  }
}
```

### 2. Get All Companies
```
GET /admin/companies
Headers: Authorization: Bearer <token>
Role: admin
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Test Company",
    "email": "company@test.com",
    "phone": "9876543210",
    "address": "Company Address",
    "gstNumber": "12ABCDE3456F7Z8",
    "companyCode": "COMP123ABC",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "userId": {
      "name": "Test Company",
      "email": "company@test.com",
      "isActive": true
    }
  }
]
```

### 3. Toggle Company Status
```
PATCH /admin/companies/:companyId/toggle
Headers: Authorization: Bearer <token>
Role: admin
```

**Response:**
```json
{
  "message": "Company disabled successfully",
  "company": {
    "_id": "507f1f77bcf86cd799439012",
    "isActive": false
  }
}
```

### 4. Reset Company Password
```
POST /admin/companies/:companyId/reset-password
Headers: Authorization: Bearer <token>
Role: admin
```

**Request Body:**
```json
{
  "newPassword": "newpassword123"
}
```

### 5. Get Platform Statistics
```
GET /admin/stats
Headers: Authorization: Bearer <token>
Role: admin
```

**Response:**
```json
{
  "totalCompanies": 10,
  "activeCompanies": 8,
  "totalEmployees": 150,
  "totalSupervisors": 25,
  "totalUsers": 185
}
```

---

## Company Endpoints

### 1. Register Employee
```
POST /company/employees
Headers: Authorization: Bearer <token>
Role: company
```

**Request Body:**
```json
{
  "name": "Employee Name",
  "email": "employee@test.com",
  "password": "emp123",
  "phone": "9876543210",
  "address": "Employee Address",
  "aadhaar": "123456789012",
  "pan": "ABCDE1234F",
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "ABCD0001234",
    "bankName": "Test Bank",
    "accountHolderName": "Employee Name"
  },
  "salaryStructure": {
    "basicSalary": 30000,
    "hra": 10000,
    "allowances": 5000,
    "pfApplicable": true,
    "pfAmount": 3600,
    "esiApplicable": false,
    "esiAmount": 0
  }
}
```

### 2. Get All Employees
```
GET /company/employees
Headers: Authorization: Bearer <token>
Role: company
```

### 3. Update Employee
```
PUT /company/employees/:employeeId
Headers: Authorization: Bearer <token>
Role: company
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "9999999999",
  "salaryStructure": {
    "basicSalary": 35000,
    "hra": 12000,
    "allowances": 6000,
    "grossSalary": 53000,
    "pfApplicable": true,
    "pfAmount": 4200
  }
}
```

### 4. Upload Employee Document
```
POST /company/employees/:employeeId/documents
Headers: Authorization: Bearer <token>
Role: company
```

**Request Body:**
```json
{
  "name": "Aadhaar Card",
  "url": "https://example.com/documents/aadhaar.pdf"
}
```

### 5. Register Supervisor
```
POST /company/supervisors
Headers: Authorization: Bearer <token>
Role: company
```

**Request Body:**
```json
{
  "name": "Supervisor Name",
  "email": "supervisor@test.com",
  "password": "super123",
  "phone": "9876543210",
  "address": "Supervisor Address"
}
```

### 6. Get All Supervisors
```
GET /company/supervisors
Headers: Authorization: Bearer <token>
Role: company
```

### 7. Get Attendance Summary
```
GET /company/attendance?month=1&year=2024&employeeId=507f1f77bcf86cd799439011
Headers: Authorization: Bearer <token>
Role: company
```

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year
- `employeeId` (optional): Specific employee ID

---

## Attendance Endpoints

### 1. Mark Attendance
```
POST /attendance
Headers: Authorization: Bearer <token>
Role: supervisor
```

**Request Body:**
```json
{
  "employeeId": "507f1f77bcf86cd799439011",
  "date": "2024-01-15",
  "status": "Present",
  "remarks": "On time",
  "checkInTime": "09:00",
  "checkOutTime": "18:00"
}
```

**Status Options:**
- `Present`
- `Absent`
- `Half-day`
- `Leave`

### 2. Get Employees for Attendance
```
GET /attendance/employees
Headers: Authorization: Bearer <token>
Role: supervisor
```

### 3. Get Today's Attendance
```
GET /attendance/today
Headers: Authorization: Bearer <token>
Role: supervisor
```

### 4. Get Employee Attendance
```
GET /attendance/employee/:employeeId?month=1&year=2024
Headers: Authorization: Bearer <token>
Role: supervisor, company, employee
```

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year

---

## Salary Endpoints

### 1. Generate Salary
```
POST /salary/generate
Headers: Authorization: Bearer <token>
Role: company
```

**Request Body:**
```json
{
  "employeeId": "507f1f77bcf86cd799439011",
  "month": 1,
  "year": 2024,
  "totalWorkingDays": 26
}
```

**Response:**
```json
{
  "message": "Salary generated successfully",
  "salary": {
    "_id": "507f1f77bcf86cd799439013",
    "employeeId": "507f1f77bcf86cd799439011",
    "month": 1,
    "year": 2024,
    "totalWorkingDays": 26,
    "presentDays": 22,
    "halfDays": 2,
    "paidLeaves": 1,
    "absentDays": 1,
    "daysWorked": 24,
    "basicSalary": 30000,
    "hra": 10000,
    "allowances": 5000,
    "grossSalary": 45000,
    "perDaySalary": 1730.77,
    "monthlyEarnings": 41538.48,
    "pfDeduction": 3600,
    "esiDeduction": 0,
    "totalDeductions": 3600,
    "netSalary": 37938.48,
    "status": "generated"
  }
}
```

### 2. Get All Salaries
```
GET /salary/all?month=1&year=2024
Headers: Authorization: Bearer <token>
Role: company
```

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year

### 3. Get Employee Salary
```
GET /salary/employee/:employeeId?month=1&year=2024
Headers: Authorization: Bearer <token>
Role: company
```

### 4. Get My Payslips
```
GET /salary/my-payslips
Headers: Authorization: Bearer <token>
Role: employee
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "employeeId": {
      "name": "Employee Name",
      "email": "employee@test.com"
    },
    "month": 1,
    "year": 2024,
    "totalWorkingDays": 26,
    "presentDays": 22,
    "halfDays": 2,
    "paidLeaves": 1,
    "absentDays": 1,
    "daysWorked": 24,
    "grossSalary": 45000,
    "monthlyEarnings": 41538.48,
    "totalDeductions": 3600,
    "netSalary": 37938.48,
    "status": "generated",
    "generatedAt": "2024-02-01T10:00:00.000Z"
  }
]
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Common Error Responses

### Authentication Error
```json
{
  "message": "Invalid authentication token"
}
```

### Authorization Error
```json
{
  "message": "Access denied"
}
```

### Validation Error
```json
{
  "message": "Email already registered"
}
```

---

## Salary Calculation Formula

The salary is calculated using the following formula:

```
PerDaySalary = GrossSalary / TotalWorkingDays

DaysWorked = PresentDays + PaidLeaves + (HalfDays × 0.5)

MonthlyEarnings = PerDaySalary × DaysWorked

Deductions = PF + ESI

NetSalary = MonthlyEarnings - Deductions
```

**Example:**
- Gross Salary: ₹45,000
- Total Working Days: 26
- Present Days: 22
- Half Days: 2
- Paid Leaves: 1
- PF: ₹3,600

Calculation:
- Per Day Salary = 45,000 / 26 = ₹1,730.77
- Days Worked = 22 + 1 + (2 × 0.5) = 24 days
- Monthly Earnings = 1,730.77 × 24 = ₹41,538.48
- Net Salary = 41,538.48 - 3,600 = ₹37,938.48

---

## Rate Limiting

To prevent abuse, API endpoints may be rate-limited. Implement the following limits in production:

- Authentication endpoints: 5 requests per minute
- Read endpoints: 100 requests per minute
- Write endpoints: 30 requests per minute

---

## Pagination

For endpoints returning large datasets, implement pagination:

```
GET /api/endpoint?page=1&limit=10
```

Response includes:
```json
{
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@staffing.com","password":"admin123"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Register Company
```bash
curl -X POST http://localhost:5000/api/admin/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Company",
    "email": "company@test.com",
    "phone": "9876543210",
    "address": "Test Address",
    "gstNumber": "12ABCDE3456F7Z8",
    "password": "company123"
  }'
```

---

## Testing with Postman

1. Import the API endpoints into Postman
2. Create an environment with:
   - `base_url`: http://localhost:5000/api
   - `token`: (will be set after login)
3. Login and save the token
4. Use `{{base_url}}` and `{{token}}` in requests

---

## WebSocket Support (Future Enhancement)

For real-time features like live attendance updates:

```javascript
const socket = io('http://localhost:5000');

socket.on('attendance-marked', (data) => {
  console.log('New attendance:', data);
});
```

---

## API Versioning

Current version: v1

Future versions will be accessible via:
```
/api/v2/endpoint
```

---

## Security Notes

1. Always use HTTPS in production
2. Store JWT tokens securely (httpOnly cookies recommended)
3. Implement CSRF protection
4. Validate all inputs
5. Use parameterized queries to prevent injection
6. Implement request logging
7. Setup rate limiting
8. Use strong JWT secrets (minimum 32 characters)

# Deployment Guide

This guide explains how to deploy the Staffing Management System in different environments.

## Local Development

### Prerequisites
- Node.js v14+
- MongoDB installed locally or MongoDB Atlas account

### Steps

1. **Setup MongoDB**
   ```bash
   # If using local MongoDB
   mongod --dbpath /path/to/your/data

   # Or use MongoDB Atlas and update MONGODB_URI in .env
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your settings
   node scripts/createAdmin.js
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend URL
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Login with admin@staffing.com / admin123

## Production Deployment

### Option 1: Single Server (VPS/EC2)

#### Backend Setup

1. **Install Node.js and MongoDB**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y mongodb
   ```

2. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd backend
   npm install --production
   ```

3. **Configure Environment**
   ```bash
   nano .env
   ```
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/staffing_management
   JWT_SECRET=your_super_secure_random_string_here
   NODE_ENV=production
   ```

4. **Setup PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name staffing-backend
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx as Reverse Proxy**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/staffing
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/staffing /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### Frontend Setup

1. **Build Frontend**
   ```bash
   cd frontend
   npm install
   VITE_API_URL=https://your-domain.com/api npm run build
   ```

2. **Configure Nginx for Frontend**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       root /path/to/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 2: Cloud Services

#### Backend on Heroku

1. **Install Heroku CLI and login**
   ```bash
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create staffing-backend
   ```

3. **Setup MongoDB Atlas**
   - Create account at mongodb.com/atlas
   - Create cluster and get connection string

4. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_secure_secret
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a staffing-backend
   git push heroku main
   ```

6. **Create admin user**
   ```bash
   heroku run node scripts/createAdmin.js
   ```

#### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variable**
   - Go to Vercel dashboard
   - Add environment variable: `VITE_API_URL=https://your-backend.herokuapp.com/api`
   - Redeploy

### Option 3: Docker Deployment

1. **Create Dockerfile for Backend**
   ```dockerfile
   # backend/Dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 5000
   CMD ["node", "server.js"]
   ```

2. **Create Dockerfile for Frontend**
   ```dockerfile
   # frontend/Dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     mongodb:
       image: mongo:6
       volumes:
         - mongodb_data:/data/db
       ports:
         - "27017:27017"

     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - MONGODB_URI=mongodb://mongodb:27017/staffing_management
         - JWT_SECRET=${JWT_SECRET}
         - NODE_ENV=production
       depends_on:
         - mongodb

     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend

   volumes:
     mongodb_data:
   ```

4. **Deploy**
   ```bash
   docker-compose up -d
   ```

## Environment-Specific Configuration

### Development
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/staffing_dev
JWT_SECRET=dev_secret_key
NODE_ENV=development
```

### Staging
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/staffing_staging
JWT_SECRET=staging_secure_key
NODE_ENV=staging
```

### Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/staffing_production
JWT_SECRET=production_very_secure_random_key
NODE_ENV=production
```

## Post-Deployment Checklist

- [ ] Change default admin password
- [ ] Setup SSL/HTTPS
- [ ] Configure CORS properly
- [ ] Setup backups for MongoDB
- [ ] Configure monitoring and logging
- [ ] Setup rate limiting
- [ ] Configure firewall rules
- [ ] Test all user roles
- [ ] Verify email notifications (if implemented)
- [ ] Setup error tracking (e.g., Sentry)
- [ ] Configure auto-scaling (if using cloud)
- [ ] Setup CI/CD pipeline
- [ ] Document API endpoints
- [ ] Create admin user guide
- [ ] Setup database backup schedule

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs staffing-backend
```

### Database Backup
```bash
# MongoDB backup
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)

# Automated backup script
0 2 * * * mongodump --uri="your_mongodb_uri" --out=/backup/$(date +\%Y\%m\%d)
```

### Log Monitoring
```bash
# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Application logs
pm2 logs staffing-backend --lines 100
```

## Troubleshooting

### Backend not starting
- Check MongoDB connection
- Verify environment variables
- Check port availability
- Review logs: `pm2 logs`

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS configuration
- Verify backend is running
- Check network/firewall rules

### Database connection issues
- Verify MongoDB is running
- Check connection string
- Verify network access (especially for MongoDB Atlas)
- Check firewall rules

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Run multiple backend instances
- Use Redis for session management
- Setup database replication

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable database indexing
- Implement caching strategy

## Security Best Practices

1. Always use HTTPS in production
2. Keep dependencies updated
3. Use strong JWT secrets (minimum 32 characters)
4. Implement rate limiting
5. Validate all inputs
6. Use prepared statements for database queries
7. Enable MongoDB authentication
8. Regularly backup data
9. Monitor for suspicious activities
10. Use environment variables for sensitive data

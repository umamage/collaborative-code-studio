# Deploying to Render

This guide will help you deploy the Collaborative Code Studio to Render.

## Prerequisites

1. A [Render account](https://render.com) (free tier available)
2. Your code pushed to a GitHub repository
3. Git installed locally

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create a new Blueprint on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and set up:
     - Web service (Docker)
     - PostgreSQL database
     - Environment variables

3. **Deploy**
   - Click "Apply" to create the services
   - Wait for the build to complete (~5-10 minutes)
   - Your app will be live at `https://collaborative-code-studio.onrender.com`

### Option 2: Manual Setup

1. **Create PostgreSQL Database**
   - Go to Render Dashboard → "New" → "PostgreSQL"
   - Name: `collaborative-code-studio-db`
   - Plan: Free
   - Click "Create Database"
   - Copy the "Internal Database URL"

2. **Create Web Service**
   - Go to Render Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name**: `collaborative-code-studio`
     - **Environment**: `Docker`
     - **Region**: Oregon (or closest to you)
     - **Plan**: Free
     - **Health Check Path**: `/api`

3. **Configure Environment Variables**
   - Add environment variable:
     - Key: `DATABASE_URL`
     - Value: Paste the Internal Database URL from step 1

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

## Post-Deployment

### Access Your Application
- **Application URL**: `https://your-service-name.onrender.com`
- **API Docs**: `https://your-service-name.onrender.com/docs`

### Monitor Logs
- Go to your service in Render Dashboard
- Click "Logs" tab to see real-time logs

### Update Deployment
- Push changes to GitHub
- Render will automatically rebuild and redeploy

## Important Notes

### Free Tier Limitations
- **Web Service**: Spins down after 15 minutes of inactivity
- **Database**: 90-day expiration, 1GB storage limit
- **First request**: May take 30-60 seconds after spin-down

### Upgrade to Paid Plan
For production use, consider upgrading:
- **Web Service**: $7/month (always on, no spin-down)
- **Database**: $7/month (persistent, no expiration)

## Troubleshooting

### Build Fails
- Check Render logs for errors
- Ensure Dockerfile is in repository root
- Verify all dependencies are in `backend/pyproject.toml` and `frontend/package.json`

### Database Connection Issues
- Verify `DATABASE_URL` environment variable is set
- Check database is in "Available" status
- Ensure using "Internal Database URL" not "External"

### Application Not Loading
- Check health check endpoint `/api` returns 200
- Review application logs in Render dashboard
- Verify port 8000 is exposed in Dockerfile

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)

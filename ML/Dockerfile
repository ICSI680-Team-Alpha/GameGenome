# Use Python 3.12.3 slim image as base
FROM python:3.12.3-slim

# Set work directory
WORKDIR /

# Install system dependencies
RUN apt-get update && apt-get install -y

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create and switch to non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port (default FastAPI port)
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
# GameGenome

GameGenome is a Pandora-like web application that recommends video games to users based on their responses to a personalized quiz. The project leverages a modern React frontend and a Python backend, and is deployed on AWS.

## Live Demo

Access the deployed application here: [http://54.87.3.247:3000/](http://54.87.3.247:3000/)

## Features
- Personalized video game recommendations
- Quiz-based user preference collection
- User accounts and favorites
- Modern, responsive UI
- Deployed on AWS (EC2, Docker)

## Project Structure

- `/Frontend` — React app (TypeScript, MUI, React Router)
- `/Backend` — Python backend (Flask/FastAPI, REST API)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Python 3.8+
- Docker (optional, for containerized deployment)

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173` by default.

### Backend Setup

```bash
cd Backend
pip install -r requirements.txt
python app.py  # or your backend entrypoint
```
The backend will run on the port specified in your backend config (commonly 5000 or 8000).

### Environment Variables
- Configure any necessary API keys or environment variables in `.env` files in both `Frontend` and `Backend` as needed.

## Deployment

### AWS Deployment
- The application is deployed on AWS EC2 using Docker containers for both frontend and backend.
- The live site is available at: [http://54.87.3.247:3000/](http://54.87.3.247:3000/)
- To deploy, build Docker images for both frontend and backend, push to your registry, and run on your EC2 instance.

### Docker Example

```bash
# Frontend
cd Frontend
docker build -t gamegenome-frontend .
docker run -d -p 3000:3000 gamegenome-frontend

# Backend
cd Backend
docker build -t gamegenome-backend .
docker run -d -p 5000:5000 gamegenome-backend
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---

Built with ❤️ by the GameGenome team.

**Made by:**
- Shelley Massinga
- Henry Qiu
- Alex Bailey
- Darcy Woodruff
- Brandon Williams

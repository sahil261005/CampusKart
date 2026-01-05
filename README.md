# CampusKart

CampusKart is a full-stack platform for college students to buy and sell pre-owned essentials such as books, calculators, and study notes. The backend is powered by Django REST Framework with JWT authentication, while the frontend is a React application styled with Tailwind CSS.

## Tech Stack

- **Backend:** Django, Django REST Framework, SimpleJWT, SQLite
- **Frontend:** React (Create React App), Tailwind CSS
- **Tooling:** npm, Node.js, Python 3.13, Pillow, PyPDF for PDF previews

## Project Structure

```
campuskart/
├── campuskart_backend/   # Django project (accounts, marketplace, notes apps)
├── campuskart_frontend/  # React + Tailwind single page application
├── CHANGELOG.md
├── requirements.txt
└── README.md
```

## Backend Setup

1. Create and activate a virtual environment (optional but recommended).
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Apply database migrations:
   ```bash
   python campuskart_backend/manage.py migrate
   ```
4. Run the development server:
   ```bash
   python campuskart_backend/manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/`.

### Environment Variables

For local development the default configuration is sufficient. If you wish to override Django settings (e.g., `SECRET_KEY`, database), use a `.env` file and load it in `settings.py` as needed.

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd campuskart_frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm start
   ```

   The React app runs at `http://localhost:3000` and communicates with the Django API at `http://localhost:8000/api`.

4. Create a production build:
   ```bash
   npm run build
   ```

## Authentication Flow

- Register: `POST /api/register/`
- Login (JWT): `POST /api/token/`
- Refresh token: `POST /api/token/refresh/`
- Get profile: `GET /api/profile/`

The frontend stores the JWT pair in `localStorage` and automatically refreshes the access token when expired.

## Marketplace API

- List items: `GET /api/items/`
- Create item (auth required): `POST /api/items/`
- Retrieve item: `GET /api/items/<id>/`
- Delete item (seller only): `DELETE /api/items/<id>/`

## Notes API

- List notes: `GET /api/notes/`
- Upload note (auth required): `POST /api/notes/`
- Retrieve note: `GET /api/notes/<id>/`

PDF previews return the extracted text of the first `preview_pages` pages.

## Frontend Features

- Tailwind-styled pages: Login, Register, Marketplace, Sell Item, Notes
- Navbar with conditional authentication links
- Marketplace filters by category, price range, search term, plus "My Listings" toggle
- Notes page with upload form, preview snippets, and download links
- Auth-aware fetch helper that attaches JWT automatically

## Running Tests

- Backend checks:
  ```bash
  python campuskart_backend/manage.py check
  python campuskart_backend/manage.py test
  ```
- Frontend build (smoke test):
  ```bash
  npm run build
  ```

## Screenshots

> _Placeholder: add UI screenshots here once the interface is finalized._

## License

This repository is intended for the CampusKart student marketplace project. Add licensing details here if required.

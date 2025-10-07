## Members Management Dashboard

Administrative dashboard for reviewing and filtering members. The project uses the Next.js App Router, Tailwind CSS with shadcn/ui primitives, and a json-server mock backend that enforces token-based access.

### Prerequisites

- Node.js >= 16 (the project was scaffolded with Next 13.5.6).
- npm (recommended) for package scripts.

Install dependencies once:

```bash
npm install
```

### Running the application

From the `members-admin` directory run the mock API and the web app in separate terminals:

```bash
# Terminal 1 - start the mock API on http://localhost:4000
npm run dev:api

# Terminal 2 - start Next.js on http://localhost:3000
npm run dev
```

If you prefer a different backend host, set `JSON_SERVER_BASE_URL` before starting the Next.js server.

### Authentication

Log in using the seeded admin account:

- **Username:** `admin`
- **Password:** `admin123`

Successful authentication issues a token (stored as `admin-token`) that is required for accessing the members endpoints.

### Key features

- Members table with columns for name, verification status, balance, contact information, domain, registration date, account status, and last activity.
- Dynamic filtering by name, domain, email address, mobile number, username, verification status, account status, and date ranges.
- Paginated results with previous/next controls and selectable page sizes (10, 25, 50).
- Color-coded status indicators aligned with the theme tokens defined in `theme/tokens.ts`.
- Typed service layer (`lib/services`) to interact with the mock API plus cached filter metadata for quick dropdown population.

### Project structure highlights

- `app/(auth)/login` - lightweight login page with server actions for credential validation.
- `app/members` - dashboard route organized into `features/`, `hooks/`, and `utils/` per the Always Rules document.
- `app/api/members` - server-side proxy that talks to json-server endpoints and applies combined filtering and pagination.
- `components/ui` - shadcn-inspired primitives (button, input, popover, command palette, etc.) themed with tokens.

### Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Run the Next.js dev server |
| `npm run dev:api` | Start the json-server mock API |
| `npm run build` | Build the Next.js app |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

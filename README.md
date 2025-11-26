# Vite Template

This is a Vite-based template for building React applications with TypeScript. The template includes configurations for linting, formatting, routing, and development.

## Features

- **React** - JavaScript library for building user interfaces.
- **React Router** - Declarative routing for React.
- **Bootstrap** - A popular CSS framework for responsive design, styled with react-bootstrap.
- **TypeScript** - A statically typed superset of JavaScript.
- **Prettier** - Code formatter.
- **ESLint** - Linter for maintaining code quality.
- **Vite** - A fast build tool and development server.

## Setup

To get started with this project, follow the steps below:

1. Clone this repository to your local machine.

2. Install dependencies using npm:

`npm install`

## Available Scripts

After installing dependencies, you can use the following npm commands:

`npm run dev`:

- Starts the development server with hot-reloading.
- Visit http://localhost:5173 in your browser to see the app.

`npm run build`:

- Builds the app for production by compiling TypeScript files and optimizing the project.

`npm run format`:

- Automatically formats all files in the project using Prettier to ensure consistent code style.

`npm run lint`:

- Runs ESLint to check for any code quality issues in your files and ensures adherence to coding standards.

`npm run preview`:

- Serves the production build locally, simulating the production environment for previewing the final build.

## Project Structure

Here’s an overview of the directory structure:

```
src/
├── context/               # Contexts and providers
├── hooks/                 # Custom hooks
├── pages/                 # Page components
├── routes/                # Routing components
└── ...                    # Other directories (components, assets)
```

## Context Pattern:

When adding a new set of related routes (e.g., ReportsRoutes), create a new context, provider, and corresponding hook as needed.

Wrap the new routes with the new provider, similar to how DashboardProvider is used in DashboardRoutes.tsx.

Ensure that custom hooks are placed in the /hooks/ directory and are named appropriately (e.g., useReportsContext).

```
src/
├── context/               # Folder for all context and provider files
│   ├── AppContext.tsx     # Global app context (e.g., user, loading state)
│   ├── AppProvider.tsx
│   ├── DashboardContext.tsx # Dashboard-specific context
│   ├── DashboardProvider.tsx
│   └── ...
├── hooks/                 # Folder for custom hooks
│   ├── useAppContext.ts   # Custom hook for accessing AppContext
│   ├── useDashboardContext.ts # Custom hook for accessing DashboardContext
│   └── ...
├── pages/                 # Folder for all the page components
│   ├── DashboardOverview.tsx  # Dashboard overview page
│   ├── DashboardView.tsx      # Dashboard detailed view page
│   └── ...                # Other pages
├── routes/                # Folder for routing components
│   ├── DashboardRoutes.tsx  # Define and wrap dashboard-related routes, uses DashboardProvider
│   └── ...                # Other routing files for features
├── App.tsx                # Main entry point of the app, uses AppProvider
└── ...
```

## Adding New Routes

The `AppNavbar.tsx` file defines a responsive navigation bar using react-bootstrap components (Navbar, Nav, NavDropdown, and Container) and integrates it with `react-router-dom` for navigation.

1. Update the navRoutes array in `AppNavbar.tsx`:

    - Add new routes with path and label.
    - If the route has sub-routes, nest them under the children key.

2. Create New Page Components:

    - Place new components in the `src/pages/` directory.
    - Example: `src/pages/NewPage.tsx`.

3. Update Routing:

    - Define new `<Route />` elements for the paths in the routes file, under `src/routes/`.

4. Ensure Navbar Reflects New Routes:

    - If the new route is a dropdown or submenu, ensure it’s added to the `navRoutes` array correctly.
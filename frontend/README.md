# OASCMS (Overseas Apartment Sales & Contract Management System)

OASCMS is a comprehensive dashboard for managing overseas apartment sales, contracts, and tenant relationships.

## Features

- **Dashboard**: Overview of key metrics (Active Contracts, Revenue, etc.).
- **Project Management**: Manage multiple construction projects, blocks, buildings, and units.
- **Contract Management**: Track contracts, payments, and schedules.
- **Bird's Eye View (조감도)**: Interactive visual map of the apartment complex.
    - View blocks on a 2D map.
    - Click blocks to see detailed information (Household count, description).
- **Lottery System**: Manage applicant lottery rounds and winners.
- **User Management**: Role-based access control for system users.
- **Internationalization**: Support for English and Korean.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the application**:
    Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **Icons**: Lucide React
-   **Internationalization**: next-intl

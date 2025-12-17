# OASCMS (Overseas Apartment Sales & Contract Management System)

OASCMS is a comprehensive web-based application designed for managing real estate sales, contracts, and payments. It provides a robust platform for sales administrators, governance managers, and customers to interact with property data, track reservations, and manage financial records.

## Key Features

### 🏢 Unit Management
-   **Visual Dashboard**: Interactive charts showing inventory distribution by type and status.
-   **Bird's Eye View**: Interactive 2D map for visualizing block locations and details.
-   **Status Tracking**: Real-time tracking of unit status (Available, Reserved, ContractPending, Sold).
-   **Bulk Import/Export**: CSV support for mass updating unit data.

### 🌍 Internationalization & UX
-   **Multi-language Support**: Full support for English, Korean (한국어), and Arabic (العربية).
-   **Dark Mode**: Native dark mode support for all interfaces.

### 👥 Lead & Reservation Management
-   **Lead Tracking**: Manage potential buyers with source tracking and status updates.
-   **Reservations**: Create and manage unit reservations with expiry dates.
-   **Lottery System**: Manage applicant lotteries for high-demand units.

### 📝 Contract Management
-   **Digital Contracts**: Create and manage sales contracts linked to specific units and buyers.
-   **Payment Schedules**: Automatically generate payment schedules (Deposit, Progress, Final) based on contract terms.
-   **Status Workflow**: Track contract lifecycle from Draft to Active to Completed.

### 💰 Financials & Payments
-   **Payment Recording**: Record payments against specific contracts and schedules.
-   **Search & Filter**: Advanced filtering by Payer, Buyer, Unit, Date, and Method.
-   **Auto-fill**: Smart payment entry with auto-fill from contract data and buyer selection.
-   **Financial Summaries**: Real-time calculation of paid vs. outstanding amounts.

### 🔒 Security & Access Control (RBAC)
-   **Role-Based Access**: Granular permissions for different user roles:
    -   **System Admin**: Full access.
    -   **Sales Admin**: Manage sales, contracts, and payments.
    -   **Governance Manager**: View-only access for auditing.
    -   **Buyer (Customer)**: View-only access to *own* data.
-   **Data Privacy**: Strict data filtering ensures Buyers only see their own contracts, payments, and reservations.

## Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Dark Mode First)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with persistence)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/) (English, Korean, Arabic)

## Getting Started

1.  **Prerequisites**: Ensure you have Node.js (v18+) installed.
2.  **Installation**:
    ```bash
    cd frontend
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```bash
├── frontend/
│   ├── public/          # Static assets (images, icons)
│   ├── messages/        # i18n translation files (en, ko, ar)
│   └── src/
│       ├── app/         # Next.js App Router pages
│       ├── components/  # Reusable UI components
│       ├── store/       # Zustand state management
│       └── types/       # TypeScript type definitions
```

## Contributing

1.  Create a feature branch.
2.  Commit your changes with descriptive messages.
3.  Open a Pull Request for review.

## License

Proprietary software. All rights reserved.

---
<div align="center">
  <p>Powered By <strong>Antigravity</strong></p>
</div>

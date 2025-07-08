# Personal Finance Visualizer

A modern web application for tracking personal finances with detailed analytics and visualizations.

## Features

### Stage 1: Basic Transaction Tracking ✅
- Add, edit, and delete transactions (amount, date, description)
- Transaction list view with sorting
- Monthly expenses bar chart
- Basic form validation
- Responsive design

### Stage 2: Categories ✅
- Predefined categories for transactions (Food & Dining, Transportation, Entertainment, etc.)
- Category-wise pie chart showing spending breakdown
- Dashboard with summary cards:
  - Total income and expenses
  - Current balance
  - Total transaction count
  - Recent transactions list
- Dynamic category selection based on transaction type
- Color-coded categories for better visualization

### Stage 3: Budgeting (Coming Soon)
- Set monthly category budgets
- Budget vs actual comparison chart
- Simple spending insights

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB with Mongoose
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personalexpencetracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/personal-finance
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Transactions
1. Click "Add Transaction" button
2. Select transaction type (Expense or Income)
3. Choose a category from the predefined list
4. Fill in the amount, description, and date
5. Click "Add" to save

### Categories Available

**Expense Categories:**
- Food & Dining
- Transportation
- Entertainment
- Shopping
- Healthcare
- Utilities
- Housing
- Education
- Travel
- Other

**Income Categories:**
- Salary
- Freelance
- Investment
- Gift

### Dashboard Features
- **Summary Cards**: View total income, expenses, balance, and transaction count
- **Monthly Chart**: Track spending patterns over time
- **Category Breakdown**: See spending distribution by category
- **Recent Transactions**: Quick view of latest transactions

### Editing Transactions
1. Click the edit icon next to any transaction
2. Modify the details including category
3. Click "Update" to save changes

### Deleting Transactions
1. Click the delete icon next to any transaction
2. Confirm the deletion

## Project Structure

```
personalexpencetracker/
├── app/
│   ├── api/transactions/     # API routes for transactions
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page component
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── TransactionForm.tsx  # Transaction form component
│   ├── TransactionList.tsx  # Transaction list component
│   ├── MonthlyExpensesChart.tsx # Monthly chart component
│   ├── CategoryPieChart.tsx # Category breakdown chart
│   └── DashboardSummary.tsx # Dashboard summary cards
├── lib/
│   ├── db.ts               # Database connection
│   ├── categories.ts       # Category configuration
│   └── utils.ts            # Utility functions
├── models/
│   └── Transaction.ts      # MongoDB schema
└── public/                 # Static assets
```

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/[id]` - Get a specific transaction
- `PUT /api/transactions/[id]` - Update a transaction
- `DELETE /api/transactions/[id]` - Delete a transaction

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

# Player Retention & Monetization Experimentation Framework

A comprehensive experimentation platform for testing pricing strategies, bundle configurations, and monetization mechanics in gaming applications. This framework enables data-driven decision-making through A/B testing with real-time analytics and cohort tracking.

## 🎯 Overview

This experimentation framework is designed to help game developers and product teams optimize player retention and monetization through systematic A/B testing. It provides a complete solution for running experiments, tracking player cohorts, and analyzing key performance indicators (KPIs) in real-time.

### Key Objectives

- **Increase Learning Velocity**: 25% faster experiment cycle times
- **Data-Driven Decisions**: Real-time KPI tracking and analytics
- **Player-First Approach**: Guardrail metrics to ensure positive player experience
- **SQL-Based Architecture**: Robust cohort analysis and retention tracking

## ✨ Features

### 🧪 A/B Testing Framework
- **Multi-Variant Support**: Test up to 4 variants (A, B, C, D) simultaneously
- **Python-Based Engine**: Randomized player assignment with statistical rigor
- **Experiment Lifecycle Management**: Draft, Running, Paused, and Completed states
- **Flexible Sample Sizes**: Configure test populations based on statistical needs

### 📊 Real-Time Analytics
- **KPI Monitoring**: Track ARPDAU, conversion rate, retention, engagement, and churn
- **Time Series Visualization**: Line charts, area charts, and bar charts for trend analysis
- **Variant Comparison**: Side-by-side performance metrics across test groups
- **Uplift Calculations**: Automatic calculation of performance improvements

### 👥 Cohort Analysis
- **SQL-Based Tracking**: Robust player-level data with retention metrics
- **Multi-Day Retention**: Track Day 1, Day 7, and Day 30 retention rates
- **Conversion Tracking**: Monitor player conversion status and spending patterns
- **CSV Export**: Download cohort data for external analysis
- **Advanced Filtering**: Search by player ID, filter by variant

### 🛡️ Guardrail Metrics
- **Churn Rate Monitoring**: Automatic alerts when churn exceeds 10%
- **Engagement Thresholds**: Ensure playtime stays above 30 minutes
- **Retention Safeguards**: Monitor Day 7 retention remains above 35%
- **Real-Time Alerts**: Visual indicators for unhealthy metric states

### 📈 Experiment Examples
- Premium Bundle Pricing Tests ($9.99 vs $14.99 vs $19.99)
- Starter Pack Bundle Sizes (100 vs 250 vs 500 coins)
- Daily Deal Frequency (once vs twice vs three times daily)
- VIP Subscription Tiers (2-tier vs 3-tier vs 4-tier models)
- First Purchase Discounts (20% vs 30% vs 50% off)

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 15.2.4](https://nextjs.org/) with App Router
- **Language**: TypeScript 5
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Styling**: [Tailwind CSS 4.1.9](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/) for data visualization
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Vercel Analytics

### Backend
- **API**: Next.js API Routes (Server-side)
- **Runtime**: Node.js
- **Data Layer**: TypeScript interfaces with mock data support

### Development
- **Package Manager**: pnpm
- **Fonts**: Geist Sans & Geist Mono
- **CSS Processing**: PostCSS with Tailwind CSS plugin

## 📦 Installation

### Prerequisites
- Node.js 18+ (recommended: 20+)
- pnpm (recommended) or npm

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Player-Retention---Monetization-Experimentation-Framework.git
   cd Player-Retention---Monetization-Experimentation-Framework
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Usage

### Starting a New Experiment

1. Navigate to the **Experiments** page
2. Click **"New Experiment"** button
3. Configure experiment parameters:
   - Name and description
   - Variants (A, B, C, D)
   - Sample size
   - Start and end dates
4. Set up variant configurations (e.g., pricing tiers)
5. Launch the experiment

### Monitoring Experiments

1. **Overview Dashboard**: View summary metrics and active experiments
2. **Experiment Details**: Click any experiment to see:
   - Real-time KPI metrics by variant
   - Time series charts for trends
   - Guardrail metric status
   - Statistical significance

### Analyzing Cohorts

1. Go to the **Cohorts** page
2. Select an experiment from the dropdown
3. Filter by variant or search for specific players
4. Review cohort statistics:
   - Conversion rates
   - Retention metrics (D1, D7, D30)
   - Average spend and engagement
5. Export data to CSV for further analysis

### Viewing Analytics

1. Navigate to the **Analytics** page
2. Select "All Experiments" or a specific experiment
3. Review aggregate KPI metrics:
   - Average ARPDAU
   - Conversion rate
   - Day 7 retention
   - Churn rate
   - Average engagement
4. Analyze trend charts for each KPI
5. Monitor guardrail status

## 📁 Project Structure

```
.
├── app/                      # Next.js App Router pages
│   ├── analytics/           # Analytics dashboard page
│   ├── api/                 # API routes
│   │   ├── cohorts/        # Cohort data endpoints
│   │   ├── experiments/    # Experiment CRUD endpoints
│   │   └── kpis/           # KPI metrics endpoints
│   ├── cohorts/            # Cohort analysis page
│   ├── experiments/        # Experiment management pages
│   │   └── [id]/          # Individual experiment detail page
│   ├── settings/           # Configuration page
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Overview dashboard
│   └── globals.css         # Global styles
│
├── components/              # React components
│   ├── ui/                 # Reusable UI components (Radix UI)
│   ├── kpi-chart.tsx       # Chart component for KPI visualization
│   ├── metric-card.tsx     # Metric display card
│   ├── sidebar-nav.tsx     # Navigation sidebar
│   └── status-badge.tsx    # Experiment status badge
│
├── lib/                     # Utility libraries
│   ├── mock-data.ts        # Mock experiment and cohort data
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
│
├── public/                  # Static assets
├── styles/                  # Additional stylesheets
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🔌 API Endpoints

### Experiments

#### `GET /api/experiments`
Retrieve all experiments with their current status and configuration.

**Response:**
```json
[
  {
    "id": "exp-001",
    "name": "Premium Bundle Pricing Test",
    "description": "Testing $9.99 vs $14.99 vs $19.99 pricing",
    "status": "running",
    "variants": ["A", "B", "C"],
    "startDate": "2025-01-01",
    "endDate": null,
    "sampleSize": 15000,
    "createdAt": "2024-12-28",
    "updatedAt": "2025-01-01"
  }
]
```

#### `GET /api/experiments/[id]`
Retrieve detailed results for a specific experiment including variant metrics and time series data.

**Response:**
```json
{
  "experiment": { /* experiment object */ },
  "variantMetrics": [
    {
      "variant": "A",
      "arpdau": 2.45,
      "churnRate": 0.08,
      "conversionRate": 0.15,
      "retentionDay7": 0.42,
      "engagementMinutes": 45,
      "sampleSize": 5000,
      "uplift": 0
    }
  ],
  "timeSeriesData": {
    "arpdau": [ /* time series data */ ],
    "churn": [ /* time series data */ ],
    "engagement": [ /* time series data */ ],
    "conversion": [ /* time series data */ ]
  }
}
```

### Cohorts

#### `GET /api/cohorts/[experimentId]`
Retrieve player-level cohort data for a specific experiment.

**Response:**
```json
[
  {
    "id": "cohort-001",
    "experimentId": "exp-001",
    "variant": "A",
    "playerId": "player-12345",
    "assignedAt": "2025-01-01T00:00:00Z",
    "retentionDay1": true,
    "retentionDay7": true,
    "retentionDay30": false,
    "conversionStatus": true,
    "totalSpend": 9.99,
    "sessionCount": 12,
    "playtimeMinutes": 245
  }
]
```

### KPI Metrics

#### `GET /api/kpis`
Retrieve all KPI metrics across experiments for analytics aggregation.

**Response:**
```json
[
  {
    "experimentId": "exp-001",
    "variant": "A",
    "date": "2025-01-01",
    "arpdau": 2.45,
    "churnRate": 0.08,
    "engagementMinutes": 45,
    "conversionRate": 0.15,
    "retentionDay7": 0.42,
    "sampleSize": 5000
  }
]
```

## 📊 Data Model

### Experiment
```typescript
interface Experiment {
  id: string
  name: string
  description: string
  status: "draft" | "running" | "paused" | "completed"
  variants: ("A" | "B" | "C" | "D")[]
  startDate: string
  endDate: string | null
  sampleSize: number
  createdAt: string
  updatedAt: string
}
```

### Cohort
```typescript
interface Cohort {
  id: string
  experimentId: string
  variant: "A" | "B" | "C" | "D"
  playerId: string
  assignedAt: string
  retentionDay1: boolean
  retentionDay7: boolean
  retentionDay30: boolean
  conversionStatus: boolean
  totalSpend: number
  sessionCount: number
  playtimeMinutes: number
}
```

### KPI Metrics
```typescript
interface KPIMetrics {
  experimentId: string
  variant: "A" | "B" | "C" | "D"
  date: string
  arpdau: number
  churnRate: number
  engagementMinutes: number
  conversionRate: number
  retentionDay7: number
  sampleSize: number
}
```

## 🔧 Configuration

### Database Settings
Configure your SQL database connection in the Settings page:
- Database host
- Database name
- Connection credentials

### Experiment Engine
Python-based A/B testing configuration:
- Default sample size (recommended: 10,000+)
- Confidence level (default: 95%)
- Statistical significance threshold

### Security
Configure API keys and access controls:
- API authentication tokens
- Rate limiting settings
- Data access permissions

## 🧪 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Code Quality
- TypeScript strict mode enabled
- ESLint for code linting
- Component-based architecture
- Type-safe API routes

## 📈 Best Practices

### Experiment Design
1. **Define Clear Hypotheses**: Know what you're testing and why
2. **Set Adequate Sample Sizes**: Use statistical power calculators
3. **Run Long Enough**: Allow sufficient time for statistical significance
4. **Monitor Guardrails**: Ensure experiments don't harm player experience
5. **Document Learnings**: Record insights for future reference

### Data Analysis
1. **Wait for Significance**: Don't make decisions on early data
2. **Check Multiple Metrics**: Look beyond primary KPIs
3. **Consider Segments**: Analyze performance across player segments
4. **Account for Seasonality**: Be aware of temporal patterns
5. **Validate Results**: Cross-check findings with other data sources

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is provided as-is for educational and commercial use.

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.dev) by Vercel
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

## 📧 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for game developers and product teams optimizing player experiences**

# NEPSE Pulse

NEPSE Pulse is a React + TypeScript dashboard for exploring Nepal Stock Exchange market activity with mock, demo-grade data. It is designed as a clean showcase for market overview, stock research, sector heatmaps, and personal watchlists without claiming to provide live exchange data.

## Features

- Market overview with index, turnover, volume, and activity summaries
- Searchable stock directory with sector and sorting controls
- Detailed stock pages with historical chart ranges and key metrics
- Local watchlist persistence using browser storage
- Sector heatmap and analytics views
- Demo-data labeling throughout the UI

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts
- React Router
- TanStack Query

## Local setup

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production checks

```bash
npm run build
npm run lint
```

## Notes

This app uses realistic mock NEPSE data in the services layer for demonstration purposes. It intentionally does not present that data as live market data or execute trades.

Investment

Manufacturing

Microfinance

Life Insurance

Non-Life Insurance

Others

The size of each company should represent its relative importance, while the visual state should represent daily performance.

Make it interactive: clicking a company should open its stock details.

6. Analytics

Create an analytics page containing:

Sector performance

Top performing sectors

Worst performing sectors

Market breadth

Turnover trends

Volume trends

NEPSE historical performance

Use clean charts rather than excessive cards.

Dashboard UX

The UI should feel similar to a professional financial analytics platform while remaining simple enough for normal users.

Design principles:

Minimal

Professional

Data-focused

Spacious

Excellent typography

Strong visual hierarchy

Responsive

Desktop-first but mobile-friendly

Avoid:

Excessive gradients

Huge hero sections

Unnecessary animations

Glassmorphism everywhere

Generic SaaS landing-page design

Excessive rounded cards

Color system

Use a professional financial interface.

Base:

Dark charcoal/navy interface or very light neutral interface

Neutral backgrounds

Green for positive movement

Red for negative movement

Yellow/orange only for warnings

Do not make the entire application green just because it is a stock-market application.

Important interactions

Add:

Hover states on stocks

Clickable rows

Interactive charts

Tooltips

Search

Filtering

Sorting

Watchlist functionality

Date-range selection

Responsive navigation

Loading states

Empty states

Error states

Data architecture

Create a clean separation:

UI components
↓
Hooks
↓
Market data service
↓
API / mock provider

For example:

src/services/marketData.ts

src/data/mockStocks.ts

src/hooks/useMarketData.ts

This should make it easy to replace mock data with a real API later.

Demo data

Create realistic mock data for at least:

30–50 Nepalese listed companies

Multiple sectors

Different price ranges

Different daily changes

Different trading volumes

Historical price data

Use recognizable NEPSE symbols where possible, but clearly treat the dataset as demonstration data.

Do not imply that the displayed prices are current.

Responsive design

Desktop:

Sidebar navigation

Main dashboard

Data tables

Charts

Tablet:

Collapsible sidebar

Mobile:

Bottom navigation or compact navigation

Horizontally scrollable tables

Stacked dashboard sections

Touch-friendly controls

Error handling

Implement proper:

Loading states

API error states

Empty states

Invalid stock handling

Chart fallback states

Do not leave blank screens when data fails.

Project quality

Write clean, maintainable TypeScript.

Use reusable components.

Avoid putting everything into one large component.

Use meaningful names.

Keep business logic separate from presentation.

Do not use unnecessary dependencies.

Make the application easy for another developer to understand.

README

Create a professional README containing:

Project overview

Features

Screenshots section

Tech stack

Architecture

Data-source explanation

Installation instructions

Environment variables

Future improvements

Disclaimer that the project is for informational/educational purposes and does not provide financial advice or execute trades

GitHub quality

Structure the project as if it were a real portfolio project.

Include meaningful commits such as:

feat: create market overview dashboard

feat: add stock directory

feat: implement stock detail analytics

feat: add watchlist

feat: add sector heatmap

feat: add responsive navigation

docs: improve project README

Do not create one giant commit containing the entire application.

Final result

The finished application should look like a real NEPSE analytics product that could be shown to recruiters or clients.

Prioritize:

Excellent UI

Realistic data visualization

Clean architecture

Useful interactions

Responsive design

Professional GitHub presentation

Do not over-engineer the project. Build a polished MVP first, then add advanced functionality only if it genuinely improves the product.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b030f036-3c79-4a22-a24b-cc1c2b02c7ae).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

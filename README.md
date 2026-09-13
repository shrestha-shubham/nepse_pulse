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

## Architecture

The application keeps presentation, query state, and data access separate:

```text
Routes and components
	|
TanStack Query hooks
	|
Market data service
	|
Demo data provider
```

This makes the mock provider replaceable without changing the dashboard UI. The responsive shell provides sidebar navigation on larger screens and compact bottom navigation on mobile. Tables scroll horizontally where their full set of columns cannot fit.

## Data and disclaimer

All displayed figures are simulated and are not current exchange data. NEPSE Pulse is an informational and educational project; it does not provide financial advice, execute trades, or connect to a brokerage account.

## Future improvements

- Connect the service layer to a verified market-data provider
- Add automated tests for formatting, filtering, and chart transformations
- Add exportable watchlists and saved dashboard views

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

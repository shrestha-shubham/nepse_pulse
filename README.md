# NEPSE Pulse

Build a modern, production-quality NEPSE Market Dashboard web application focused specifically on the Nepal Stock Exchange (NEPSE).

The goal is to create a portfolio-worthy project that feels like a real financial analytics product, not a basic CRUD dashboard.

Core concept

Create a dashboard where users can monitor Nepal's stock market, explore listed companies, view price information, analyze historical performance, and maintain a personal watchlist.

The application should be designed for information and analysis only. It must NOT execute real trades or handle real money.

Tech stack

Use:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Recharts for charts

React Router

A clean API/data-service layer

PostgreSQL if persistent user data is required

Use environment variables for API keys

Do not hardcode API keys or secrets

Keep the architecture clean and modular so the data source can be replaced later without rewriting the UI.

Important data requirement

Do NOT pretend that the application has direct access to live NEPSE/broker data unless a legitimate API/data source is actually available.

Create a dedicated market-data service layer:

src/services/marketData.ts

The application should be designed so that a real API can be connected later.

For development, provide realistic mock NEPSE data through a local data provider.

Clearly label mock/demo data where appropriate.

Do not fabricate claims such as "real-time NEPSE data" when using mock data.

Pages

1. Market Overview

Create the main dashboard.

Display:

NEPSE Index

Daily change

Daily percentage change

Total market turnover

Total traded shares

Number of advancing stocks

Number of declining stocks

Number of unchanged stocks

Include:

NEPSE historical line chart

Top gainers

Top losers

Most traded companies

Recent market activity

Use realistic Nepalese formatting:

Rs. for currency

Lakhs/Crores where appropriate

Nepali company names/tickers where relevant

2. Stocks

Create a searchable stock directory.

Columns:

Symbol

Company

Sector

Last Price

Change

Change %

Volume

Turnover

Features:

Search

Sector filter

Sort by price

Sort by percentage change

Sort by volume

Sort by turnover

Make the table responsive.

3. Stock Details

Clicking a company should open a dedicated stock page.

Show:

Company name

Symbol

Sector

Current price

Daily change

52-week high

52-week low

Volume

Turnover

Market capitalization

Add an interactive historical price chart.

Allow:

1D

1W

1M

3M

6M

1Y

Add a "Add to Watchlist" button.

Include basic company information and key statistics.

4. Watchlist

Allow users to maintain a personal watchlist.

Show:

Company

Current price

Change

Change %

Last updated

Allow adding/removing stocks.

For the MVP, localStorage is acceptable instead of implementing authentication.

5. Market Heatmap

Create a visual market heatmap grouped by sector.

Example sectors:

Commercial Banks

Development Banks

Finance

Hotels & Tourism

Hydropower

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

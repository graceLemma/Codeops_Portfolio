# Addis Eats Order

A TypeScript-based food ordering system for Addis Eats.

## Features

- Defines delivery areas using a union of literal types.
- Defines order statuses using union types.
- Uses interfaces and types to structure orders and dishes.
- Calculates delivery fees based on order amounts and delivery areas.
- Formats prices in Ethiopian Birr (ETB).
- Uses switch statements to display order status messages.
- Generates formatted order receipts.
- Supports optional TeleBirr phone numbers.
- Uses strict TypeScript mode to ensure type safety.

## Delivery Areas

- Bole
- Kazanchis
- Piassa
- CMC

## Delivery Fees

- Orders above 500 ETB: Free delivery.
- Bole: 40 ETB.
- Other areas: 60 ETB.

## Installation

Install dependencies:

\`\`\`bash
npm install
\`\`\`

## Run the Project

Compile TypeScript:

\`\`\`bash
npx tsc
\`\`\`

Run the compiled JavaScript:

\`\`\`bash
node dist/order.js
\`\`\`

## Technologies

- TypeScript
- Node.js

## Type Safety

This project uses TypeScript strict mode to catch type errors during compilation and ensure reliable code.
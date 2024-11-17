# Better Used Tesla Trawling

A web application that helps you search and compare used Tesla vehicles with enhanced filtering capabilities and detailed hardware version information.

### Search View:
![image](https://github.com/user-attachments/assets/3babb533-70af-42df-a198-d5ffccb775e7)

### Compare View:
![image](https://github.com/user-attachments/assets/dd935d3c-eef1-4957-98d3-987997ec6571)


## Live Site
You can view a live version of the site at [butt.thomasburgess.dev](https://butt.thomasburgess.dev).

## Features

- **Advanced Search**: Filter Tesla inventory by model, year, price, and hardware version
- **Hardware Version Detection**: Automatically detects whether a Tesla has HW3 or HW4 based on VIN and manufacturing date
- **Side-by-Side Comparison**: Select multiple vehicles to compare their specifications
- **Price Calculation**: Toggle between different price views including:
  - Base price
  - Price with transport fees
  - Price with estimated taxes
- **Detailed Vehicle Information**: View comprehensive details including:
  - Range estimates
  - Acceleration specs
  - FSD (Full Self-Driving) status
  - Interior/exterior colors
  - VIN details
  - Factory dates

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Radix UI primitives
  - Shadcn/ui components
- **Form Handling**: React Hook Form
- **TypeScript**: For type safety and better developer experience

## Project Structure

- `/src/app`: Main application pages and layouts
- `/src/components`: Reusable UI components
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and shared code
- `/src/types`: TypeScript type definitions

## License

Created by Thomas Burgess, 2024. All rights reserved.

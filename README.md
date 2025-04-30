# Countries Explorer

A modern web application built with React that allows users to explore countries around the world, with features like searching, filtering, and favoriting countries. The project uses Redux for state management with mock data for user authentication and favorites functionality.

## Features

- **Country Exploration**: Browse through countries with detailed information
- **Search & Filters**: Search countries by name, filter by region and language
- **User Authentication**: Mock authentication system using Redux (frontend only)
- **Favorite Countries**: Save and manage your favorite countries
- **Responsive Design**: Fully responsive layout that works on all devices
- **Interactive UI**: Modern interface with smooth animations and transitions

## 🌐 Live Demo

Visit the live application: [Countries Explorer](https://af-countries-explorer.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/79cc6eea-dc17-4c9d-8644-7e850bc50729/deploy-status)](https://app.netlify.com/sites/af-countries-explorer/deploys)

## Tech Stack

- **React**: Frontend library
- **Redux**: State management
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **Lucide Icons**: Icon library
- **REST Countries API**: Country data
- **Vitest & Jest**: Testing
- **React Testing Library**: Component testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/countries-explorer.git
cd countries-explorer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
countries-explorer/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── CountryCard.jsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── ...
│   ├── redux/            # Redux store and slices
│   │   ├── store.js
│   │   └── userSlice.js
│   ├── __tests__/        # Test files
│   │   ├── components/
│   │   ├── pages/
│   │   └── redux/
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
└── ...
```

## Features in Detail

### Authentication (Mock)

The project uses Redux for state management with mock user data. No backend is required as all authentication is handled in the frontend with predefined user data.

### Available Mock Users:
```javascript
{
  email: "user@example.com",
  password: "password123"
}
```

### State Management

Redux is used to manage:
- User authentication state
- Favorite countries
- Loading states
- Error handling

### API Integration

The application uses the [REST Countries API](https://restcountries.com) to fetch country data, including:
- Country details
- Flags
- Population
- Languages
- And more...

## Testing

The application includes comprehensive testing using Vitest, Jest, and React Testing Library.

### Testing Framework

- **Vitest**: Test runner optimized for Vite projects
- **Jest**: Testing framework and assertions
- **React Testing Library**: Component testing utilities
- **Mock Service Worker**: API mocking

### Types of Tests

#### Unit Tests
- Redux store and reducers testing
- Individual component rendering and interactions
- Utility functions

#### Integration Tests
- Component interaction with Redux store
- Multi-component features
- User flow testing

### Test Coverage

The test suite covers:
- Redux state management (authentication, favorites)
- Component rendering and interactions
- API data fetching and handling
- User interactions like searching and filtering

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## Styling

The project uses Tailwind CSS for styling with:
- Responsive design
- Custom animations
- Interactive elements
- Modern UI components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

- [REST Countries API](https://restcountries.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)
- [Vitest](https://vitest.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

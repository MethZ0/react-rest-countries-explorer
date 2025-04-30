// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock for global fetch since we'll be testing API calls
global.fetch = vi.fn();

// Clean up after each test
afterEach(() => {
  vi.resetAllMocks();
});
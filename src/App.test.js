import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
describe('App tests', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => {});
  });
  test('should render the page', () => {
    render(<App />);
    const linkElement = screen.getByText("Onboarding Form");
    expect(linkElement).toBeInTheDocument();
  });
  test('fields should error if submit is pressed immediately', async () => {
    render(<App />);
    const submitButton = screen.getByText("Submit");
    submitButton.click();


    await waitFor(() => {
      const firstNameError = screen.getByText("Please enter a first name");
      const lastNameError = screen.getByText("Please enter a last name");
      const phoneNumberError = screen.getByText("Please enter a phone number");
      const corporationNumberError = screen.getByText("Please enter a corporation number");
      expect(firstNameError).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(lastNameError).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(phoneNumberError).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(corporationNumberError).toBeInTheDocument();
    });
  });
  test('should reject a long first name', async () => {
    render(<App />);
    const firstNameField = screen.getAllByPlaceholderText("First Name")[0];
    userEvent.type(firstNameField, "a".repeat(256));
    userEvent.tab();


    await waitFor(() => {
      const firstNameError = screen.getByText("Must be less than 50 characters");
      expect(firstNameError).toBeInTheDocument();
    });
  });
  test('should reject a long last name name', async () => {
    render(<App />);
    const firstNameField = screen.getAllByPlaceholderText("Last Name")[0];
    userEvent.type(firstNameField, "a".repeat(256));
    userEvent.tab();


    await waitFor(() => {
      const firstNameError = screen.getByText("Must be less than 50 characters");
      expect(firstNameError).toBeInTheDocument();
    });
  });
  test('should reject an invalid phone number', async () => {
    render(<App />);
    const firstNameField = screen.getAllByPlaceholderText("+1XXXXXXXXXX")[0];
    userEvent.type(firstNameField, "1".repeat(25));
    userEvent.tab();


    await waitFor(() => {
      const firstNameError = screen.getByText("Please enter a valid Canadian phone number starting with +1");
      expect(firstNameError).toBeInTheDocument();
    });
  });
  test('should call validate api on corporation number', async () => {
    const fetchSpy = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ valid: false })
      });
    });
    global.fetch = fetchSpy;

    render(<App />);
    const corporationNumberField = screen.getAllByPlaceholderText("Corporation Number")[0];
    userEvent.type(corporationNumberField, "123456789");
    userEvent.tab();

    await waitFor(() => {
      const invalidCorporationNumber = screen.getByText("Invalid corporation number");
      expect(invalidCorporationNumber).toBeInTheDocument();
    });
    expect(fetchSpy).toHaveBeenCalled();
  });
});

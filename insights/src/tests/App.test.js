import { render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("@azure/msal-react", () => ({
  MsalProvider: ({ children }) => <>{children}</>,
}));

jest.mock("../PageLayout", () => () => (
  <div data-testid="page-layout">PageLayout</div>
));

describe("App Component", () => {
  test("renders BrowserRouter and PageLayout", () => {
    render(<App instance={{}} />);

    expect(screen.getByTestId("page-layout")).toBeInTheDocument();
  });
});

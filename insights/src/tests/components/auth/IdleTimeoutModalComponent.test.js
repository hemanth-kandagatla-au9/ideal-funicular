import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

// expose window so mock can attach the onComplete for direct invocation
jest.mock("react-countdown-circle-timer", () => {
  const React = require("react");
  return {
    CountdownCircleTimer: ({ children, onComplete }) => {
      React.useEffect(() => {
        // attach to globalThis for test access
        // eslint-disable-next-line no-underscore-dangle
        globalThis.__onComplete = onComplete;
        return () => {
          // eslint-disable-next-line no-underscore-dangle
          delete globalThis.__onComplete;
        };
      }, [onComplete]);
      return (
        <div
          data-testid="mock-timer"
          onClick={() => onComplete && onComplete()}
        >
          {typeof children === "function"
            ? children({ remainingTime: 10 })
            : children}
        </div>
      );
    },
  };
});

import IdleTimeoutModalComponent, {
  renderTime,
} from "../../../components/auth/IdleTimeoutModalComponent";
import { UI_TEXTS } from "../../../components/common/Constants/label-contants";

describe("IdleTimeoutModalComponent", () => {
  let handleLogout;

  beforeEach(() => {
    handleLogout = jest.fn();
  });

  afterEach(() => {
    cleanup();
    // eslint-disable-next-line no-underscore-dangle
    if (globalThis.__onComplete) delete globalThis.__onComplete;
  });

  it("renders timer value from the countdown children", () => {
    const { container } = render(
      <IdleTimeoutModalComponent
        showModal={true}
        handleContinue={() => {}}
        handleLogout={handleLogout}
      />
    );

    const valueEl = document.body.querySelector(".timer-value");
    expect(valueEl).not.toBeNull();
    expect(valueEl.textContent).toBe("10");
  });

  it("calls handleLogout when the mocked timer completes", () => {
    const { getByTestId } = render(
      <IdleTimeoutModalComponent
        showModal={true}
        handleContinue={() => {}}
        handleLogout={handleLogout}
      />
    );

    // simulate the mock timer invoking onComplete by clicking its container
    fireEvent.click(getByTestId("mock-timer"));

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it("onComplete returns the expected control object", () => {
    render(
      <IdleTimeoutModalComponent
        showModal={true}
        handleContinue={() => {}}
        handleLogout={handleLogout}
      />
    );

    // call the attached onComplete directly and assert return value
    // eslint-disable-next-line no-underscore-dangle
    const returnValue = globalThis.__onComplete && globalThis.__onComplete();

    expect(returnValue).toEqual({ shouldRepeat: false, delay: 1 });
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it("renderTime returns the TOO_LATE message when remainingTime is 0", () => {
    const { getByText } = render(renderTime({ remainingTime: 0 }));
    expect(getByText(UI_TEXTS.LOADING.TOO_LATE)).toBeInTheDocument();
  });
});

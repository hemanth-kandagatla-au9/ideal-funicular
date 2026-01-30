import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "react-bootstrap";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import PopUp from "../../../components/popup/popUp.component";
import "@testing-library/jest-dom/extend-expect";
import { cancelButtonText, okButtonText } from "../../../constants/strings";
Enzyme.configure({ adapter: new Adapter() });

describe("Modal test", () => {
  const props = {
    dataObj: {
      header: "Kernal Upgrade",
      body: "Your kernal upgrade has been started, do you want to proceed to the execution page or stay on the currrent page.",
      button: {
        buttonOne: { buttonOneName: "Go to Execution View", buttonBg: "modalButtonWhite" },
        buttonTwo: { buttonTwoName: "Stay on this page", buttonBg: "modalButtonBlue" },
      },
    },
    onHide: jest.fn(),
    show: true,
  };

  it("test to check data of header, body, button", () => {
    render(<PopUp {...props} />);
    expect(screen.getByText("Kernal Upgrade")).toBeInTheDocument();
    expect(screen.getByText(/Your kernal upgrade has been started/)).toBeInTheDocument();
    expect(screen.getByText("Go to Execution View")).toBeInTheDocument();
    expect(screen.getByText("Stay on this page")).toBeInTheDocument();
  });

  it("test cancel button click", () => {
    render(<PopUp {...props} />);
    fireEvent.click(screen.getByText("Stay on this page"));
    expect(props.onHide).toHaveBeenCalledTimes(1);
  });

  it("should hide modal when close button is clicked", () => {
    props.onHide.mockClear();
    const wrapper = shallow(<PopUp {...props} />);
    wrapper.find(Modal).simulate("hide");
    expect(props.onHide).toHaveBeenCalledTimes(1);
  });

  it("should render default button texts when names are missing", () => {
    const newProps = {
      show: true,
      onHide: jest.fn(),
      dataObj: {
        header: "Test Header",
        body: "Test Body",
        button: {
          buttonOne: {},
          buttonTwo: {},
        },
      },
    };

    render(<PopUp {...newProps} />);

    expect(screen.getByText(okButtonText)).toBeInTheDocument();
    expect(screen.getByText(cancelButtonText)).toBeInTheDocument();
  });

  it("should apply danger styles when button text includes delete", () => {
    const deleteProps = {
      show: true,
      onHide: jest.fn(),
      dataObj: {
        header: "Delete Modal",
        body: "Are you sure?",
        button: {
          buttonOne: { buttonOneName: "Delete User" },
          buttonTwo: {},
        },
      },
    };

    render(<PopUp {...deleteProps} />);

    const okButton = screen.getByTestId("OkButton");

    expect(okButton).toHaveClass("modalButtonDanger");
    expect(okButton.getAttribute("id")).toBe("modalButtonDanger");
  });

  it("should call handleClick when provided instead of internal onClick", () => {
    const handleClickMock = jest.fn();
    const internalClick = jest.fn();

    const newProps = {
      show: true,
      onHide: jest.fn(),
      handleClick: handleClickMock,
      dataObj: {
        header: "Test",
        body: "Test",
        button: {
          buttonOne: { buttonOneName: "Submit", onClick: internalClick },
          buttonTwo: {},
        },
      },
    };

    render(<PopUp {...newProps} />);
    fireEvent.click(screen.getByTestId("OkButton"));

    expect(handleClickMock).toHaveBeenCalledTimes(1);
    expect(internalClick).not.toHaveBeenCalled();
  });

  it("should call internal onClick when handleClick is not provided", () => {
    const internalClick = jest.fn();

    const newProps = {
      show: true,
      onHide: jest.fn(),
      dataObj: {
        header: "Test",
        body: "Test",
        button: {
          buttonOne: { buttonOneName: "Submit", onClick: internalClick },
          buttonTwo: {},
        },
      },
    };

    render(<PopUp {...newProps} />);
    fireEvent.click(screen.getByTestId("OkButton"));

    expect(internalClick).toHaveBeenCalledTimes(1);
  });

  it("should use custom variant when provided", () => {
    const newProps = {
      show: true,
      onHide: jest.fn(),
      dataObj: {
        header: "Test",
        body: "Test",
        button: {
          buttonOne: { buttonOneName: "Submit", variant: "success" },
          buttonTwo: {},
        },
      },
    };

    render(<PopUp {...newProps} />);

    const okButton = screen.getByTestId("OkButton");
    expect(okButton.className).toContain("btn-success");
  });
});

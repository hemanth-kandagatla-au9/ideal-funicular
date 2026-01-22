import * as React from "react";
import {
  toast,
  ToastOptions,
  ToastContentProps,
  Slide,
} from "react-toastify";
import type { ReactNode, CSSProperties } from "react";

const BASE_OPTS: ToastOptions = {
  position: "top-right",
  autoClose: 2200,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  icon: false,
  closeButton: false,
  transition: Slide,
};

const TOAST_OUTER_STYLE: CSSProperties = {
  background: "transparent",
  boxShadow: "none",
  padding: 0,
  border: "none",
};

const CARD_WIDTH = "min(540px, 100vw)";
const CARD_RADIUS = "16px 0px 0px 16px";

type Variant = "success" | "error" | "warning" | "info";

const VARIANT_CONFIG: Record<
  Variant,
  {
    accent: string;
    borderGradient: string;
    fillGradient: string;
  }
> = {
  success: {
    accent: "#109A48",
    borderGradient: "linear-gradient(0deg, #109A48 0%, #59D089 100%)",
    fillGradient:
      "linear-gradient(90deg, #EDFFF4 0%, rgba(89, 208, 137, 0) 91.17%), #FFFFFF",
  },
  error: {
    accent: "#D34A4A",
    borderGradient: "linear-gradient(0deg, #D34A4A 0%, #FF7676 100%)",
    fillGradient:
      "linear-gradient(90deg, #FFE2E2 0%, rgba(255, 226, 226, 0) 91.17%), #FFFFFF",
  },
  warning: {
    accent: "#FF9700",
    borderGradient: "linear-gradient(0deg, #FF9700 0%, #FFC464 100%)",
    fillGradient:
      "linear-gradient(90deg, #FFEACB 0%, rgba(255, 234, 203, 0) 91.17%), #FFFFFF",
  },
  info: {
    accent: "#459EFF",
    borderGradient: "linear-gradient(0deg, #459EFF 0%, #7BB9FF 100%)",
    fillGradient:
      "linear-gradient(90deg, #CFE6FF 0%, rgba(207, 230, 255, 0) 91.17%), #FFFFFF",
  },
};
const parseMessage = (message: string) => {
  const idx = message.indexOf(":");
  if (idx === -1) return { main: message, sub: "" };
  return {
    main: message.slice(0, idx).trim(),
    sub: message.slice(idx + 1).trim(),
  };
};



type CloseButtonProps = {
  onClick?: () => void;
};

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  const [hovered, setHovered] = React.useState(false);

  const strokeColor = hovered ? "rgba(0, 0, 0, 1)" : "rgba(5, 6, 15, 0.6)";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 24, // bigger click area
        height: 24,
        flexShrink: 0,
        border: "none",
        background: "transparent",
        padding: 0,
        marginBottom:'40px',
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
        boxShadow: "none",
        transform: hovered ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.15s ease, opacity 0.15s ease",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4L12 12M12 4L4 12"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};



type LayoutProps = {
  message: string;
  icon: ReactNode;
  variant: Variant;
  closeToast?: () => void;
};

const VariantToastLayout: React.FC<LayoutProps> = ({
  message,
  icon,
  variant,
  closeToast,
}) => {
  const { accent, borderGradient, fillGradient } = VARIANT_CONFIG[variant];
  const { main, sub } = parseMessage(message);

  return (
    <div
      style={{
        boxSizing: "border-box",
        borderRadius: CARD_RADIUS,
        padding: 1, // border thickness
        backgroundImage: borderGradient,
        width: CARD_WIDTH,
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      
      <div
        style={{
          borderRadius: CARD_RADIUS,
          background: fillGradient,
          boxSizing: "border-box",
          minHeight: 94 - 2,
          padding: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 14,
          }}
        >
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flex: 1,
            }}
          >
            
            <div
              style={{
                width: 40,
                height: 40,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </div>

            
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontFamily: "Johnson Text, inherit",
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: "150%",
                  display: "flex",
                  alignItems: "center",
                  color: accent,
                }}
              >
                {main}
              </div>
              {sub ? (
                <div
                  style={{
                    fontFamily: "Johnson Text, inherit",
                    fontStyle: "normal",
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: "150%",
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(5, 6, 15, 0.6)",
                  }}
                >
                  {sub}
                </div>
              ) : null}
            </div>
          </div>

          
          <CloseButton onClick={() => closeToast?.()} />
        </div>
      </div>
    </div>
  );
};



const successIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="20"
      cy="20"
      r="16.6667"
      fill="#109A48"
      stroke="#109A48"
      strokeWidth="2"
    />
    <path
      d="M26 16L18 24L14 20"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const errorIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="20"
      cy="20"
      r="16.6667"
      fill="#D34A4A"
      stroke="#D34A4A"
      strokeWidth="2"
    />
    <path
      d="M25 15L15 25"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 15L25 25"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const warningIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="20"
      cy="20"
      r="16.6667"
      fill="#FF9700"
      stroke="#FF9700"
      strokeWidth="2"
    />
    <path
      d="M20 13.333V20"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 26.667H20.0167"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const infoIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="20"
      cy="20"
      r="16.6667"
      fill="#459EFF"
      stroke="#459EFF"
      strokeWidth="2"
    />
    <path
      d="M20 26.667V20"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 13.333H19.9833"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);



const successtoast = (message: string): ReactNode =>
  toast.success(
    (props: ToastContentProps) => (
      <VariantToastLayout
        message={message}
        icon={successIcon}
        variant="success"
        closeToast={props.closeToast}
      />
    ),
    { ...BASE_OPTS, style: TOAST_OUTER_STYLE }
  );

const errortoast = (message: string): ReactNode =>
  toast.error(
    (props: ToastContentProps) => (
      <VariantToastLayout
        message={message}
        icon={errorIcon}
        variant="error"
        closeToast={props.closeToast}
      />
    ),
    { ...BASE_OPTS, style: TOAST_OUTER_STYLE }
  );

const warningtoast = (message: string): ReactNode =>
  toast.warn(
    (props: ToastContentProps) => (
      <VariantToastLayout
        message={message}
        icon={warningIcon}
        variant="warning"
        closeToast={props.closeToast}
      />
    ),
    { ...BASE_OPTS, style: TOAST_OUTER_STYLE }
  );

const infotoast = (message: string): ReactNode =>
  toast.info(
    (props: ToastContentProps) => (
      <VariantToastLayout
        message={message}
        icon={infoIcon}
        variant="info"
        closeToast={props.closeToast}
      />
    ),
    { ...BASE_OPTS, style: TOAST_OUTER_STYLE }
  );

export { successtoast, errortoast, warningtoast, infotoast };


import { Global } from "iconsax-react";
import "./emptypage.css";

export default function GlobalReportsEmpty() {
  return (
    <div className="global-empty-state-container">
      <div className="icon-wrapper">
        <Global size="32" color="#2563eb" />
      </div>
      <h3 className="global-empty-state-title">No global reports available</h3>
    </div>
  );
}

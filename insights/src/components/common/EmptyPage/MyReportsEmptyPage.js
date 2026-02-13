import { DocumentText, Add } from "iconsax-react";
import "./emptypage.css";

export default function MyReportsEmpty() {
  return (
    <div className="empty-state-container-my-report">
      <div className="icon-wrapper">
        <DocumentText size="32" color="#2563eb" />
      </div>
      <h3 className="empty-state-title">No custom reports available</h3>
    </div>
  );
}

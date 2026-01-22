import { MdSync } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import "./BinaryVersionsHeader.css";
import { useHistory } from "react-router-dom";

interface BinaryVersionsHeaderProps {
  versionsCount: number;
  onSync: () => void;
  isLoading?: boolean;
}

const BinaryVersionsHeader = ({ versionsCount, onSync, isLoading }: BinaryVersionsHeaderProps) => {
  const history = useHistory();
  return (
    <div className="binary-versions-header">
      <div className="left-section">
        <IoIosArrowBack color="#000" size="25px" onClick={() => history.push("/")} style={{ cursor: "pointer" }} />
        <h2 className="title">Binary Versions</h2>
        <span className="version-count">{versionsCount}</span>
      </div>
      <div className="right-section">
        <button type="button" className="sync-button" onClick={onSync} disabled={isLoading} title="Sync versions from database">
          <div className="sync-icon">
            <MdSync className={isLoading ? "spinning" : ""} />
          </div>
          <div className="sync-text">{isLoading ? "Syncing..." : "Sync Versions"}</div>
        </button>
      </div>
    </div>
  );
};

export default BinaryVersionsHeader;


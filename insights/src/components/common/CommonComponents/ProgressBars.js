import ProgressBar from "react-bootstrap/ProgressBar";
import "./common.css";

function CommonProgressBar({ originalJobData, openSearchData, jobRunID }) {
  const totalHosts = originalJobData?.total || 0;
  const failedHosts = originalJobData?.failure || 0;
  const successHosts = totalHosts - failedHosts;

  const openSearchServersData = openSearchData
    ?.filter((each) => each.runId === jobRunID)
    ?.flatMap((each) => each.servers || []);

  const percentage = (
    (openSearchServersData?.length / successHosts) *
    100
  ).toFixed(2);
  const percentageValue =
    successHosts > 0 ? (percentage >= 100 ? 100 : percentage) : 0;
  return (
    <ProgressBar
      now={percentageValue}
      // label={`${percentage >= 100  && percentage ==="Infinity"? 100 : successHosts > 0 ? percentage : 0}%`}
      label={`${percentageValue}%`}
      className="customProgressBar"
      style={{
        height: "20px",
      }}
    />
  );
}
export default CommonProgressBar;

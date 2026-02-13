import { useEffect } from "react";

const PageTitle = props => {
  useEffect(() => {
    document.title = props.title || "";
  }, [props.title]);
  return props.children;
};

export default PageTitle;

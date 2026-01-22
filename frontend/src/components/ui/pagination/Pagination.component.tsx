import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Dropdown from "../customdropdown/Dropdown.component";
import CSSpagination from "./pagination.module.css";
import Configuration from "../../../config/config";
import { enterPlaceholderText } from "../../../constants/strings";

interface PaginationProps {
  handlePagination: (limit: number, pageNo: number) => void;
  pagination: {
    pageNo: number;
    totalPage: number;
    totalRows: number;
    limit: number;
  };
  handleRowsPerPage?: (limit: number) => void;
  marginPages?: number;
  propsClasses?: string;
}

interface PaginatedItemsProps {
  itemsPerPage: number;
  propsPagination: {
    pageNo: number;
    totalPage: number;
    totalRows: number;
    limit: number;
  };
  gotoPage: (pageNo: number) => void;
  totalPage: number;
  rowSizeData: { key: string; value: string }[];
  marginPages?: number;
}

interface PaginationItemsComponentProps {
  disabled: {
    val: boolean;
    cursor: string;
  };
  gotoPage: (pageNo: number) => void;
  totalPage: number;
  rowSizeData: { key: string; value: string }[];
  propsPagination: {
    pageNo: number;
    totalPage: number;
    totalRows: number;
    limit: number;
  };
  marginPages?: number;
}

interface DropdownItem {
  key: string;
  value: string;
}


function PaginatedItems({ itemsPerPage, propsPagination, gotoPage, totalPage, rowSizeData, marginPages = 2 }: PaginatedItemsProps) {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(propsPagination.totalRows / itemsPerPage));
  }, [itemOffset, itemsPerPage, propsPagination]);

  const handlePageClick = (event: { selected: number }) => {
    const selectedPage = event.selected + 1;
    const newOffset = (event.selected * itemsPerPage) % propsPagination.totalRows;
    setItemOffset(newOffset);
    gotoPage(selectedPage);
  };

  const next = { color: "#82807C", disabled: true, cursor: "not-allowed" };
  const previous = { color: "#82807C", disabled: true, cursor: "not-allowed" };

  if (propsPagination.pageNo === 1 || (propsPagination.pageNo === totalPage && propsPagination.pageNo === 1)) {
    previous.color = "#82807C";
    previous.disabled = true;
    previous.cursor = "not-allowed";
  } else {
    previous.color = "#344054";
    previous.disabled = false;
    previous.cursor = "";
  }

  if (propsPagination.pageNo !== totalPage) {
    next.color = "#344054";
    next.disabled = false;
    next.cursor = "";
  } else {
    next.color = "#82807C";
    next.disabled = true;
    next.cursor = "not-allowed";
  }

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={
        <span style={{ cursor: next.disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
          Next
          <svg
            id="nbtn"
            data-testid="nbtn"
            style={{ cursor: next.cursor }}
            disabled={next.disabled}
            width="11"
            height="10"
            viewBox="0 0 11 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.25 0.950001L11 4.7V5.75L7.25 9.5L6.185 8.45L8.645 5.975L0.289999 5.975V4.475L8.645 4.475L6.17 2L7.25 0.950001Z" fill={next.color} />
          </svg>
        </span>
      }
      previousLabel={
        <span style={{ cursor: previous.disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
          <svg style={{ cursor: previous.cursor }} disabled={previous.disabled} width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.75 9.05L0 5.3V4.25L3.75 0.5L4.815 1.55L2.355 4.025H10.71V5.525H2.355L4.83 8L3.75 9.05Z" fill={previous.color} />
          </svg>
          Prev
        </span>
      }
      onPageChange={handlePageClick}
      pageRangeDisplayed={rowSizeData.length}
      pageCount={pageCount}
      renderOnZeroPageCount={null}
      pageClassName={CSSpagination.risebot_paginationItem}
      pageLinkClassName={CSSpagination.risebot_paginationLink}
      previousClassName={CSSpagination.risebot_navItem}
      previousLinkClassName={CSSpagination.risebot_navLink}
      nextClassName={CSSpagination.risebot_navItem}
      nextLinkClassName={CSSpagination.risebot_navLink}
      breakClassName={CSSpagination.break}
      breakLinkClassName={CSSpagination.risebot_paginationLink}
      marginPagesDisplayed={marginPages}
      activeClassName={CSSpagination.active}
      containerClassName="pagination"
      forcePage={propsPagination.pageNo - 1}
    />
  );
}

function PaginationItemsComponent({ disabled, gotoPage, totalPage, rowSizeData, propsPagination, marginPages = 2 }: PaginationItemsComponentProps) {
  return !disabled.val ? (
    <PaginatedItems
      gotoPage={gotoPage}
      totalPage={totalPage}
      rowSizeData={rowSizeData}
      propsPagination={propsPagination}
      itemsPerPage={propsPagination.limit || Configuration.ROWS_PER_PAGE}
      marginPages={marginPages}
    />
  ) : null;
}

function Pagination(props: PaginationProps) {
  const { handlePagination: propsHandlePagination, pagination: propsPagination, handleRowsPerPage, marginPages = 2, propsClasses } = props;
  let limit = propsPagination.limit === 0 ? Configuration.ROWS_PER_PAGE : propsPagination.limit;
  const [rowSize, setRowSize] = useState<number>(limit);
  const [jumpPage, setJumpPage] = useState<number | string>("");
  const [disabled, setDisabled] = useState({
    val: true,
    cursor: "not-allowed",
  });
  const [rowSizeData, setRowSizeData] = useState<DropdownItem[]>([]);

  const handleRowData = (e: string) => {
    const numValue = Number(e);
    setRowSize(numValue);
    limit = numValue;
    propsHandlePagination(numValue, 1);
    if (handleRowsPerPage) handleRowsPerPage(numValue);
  };

  useEffect(() => {
    const recordsPerPage: DropdownItem[] = [
      { key: "10", value: "10" },
      { key: "20", value: "20" },
      { key: "50", value: "50" },
      { key: "100", value: "100" },
      { key: "500", value: "500" },
    ];
    setRowSizeData(recordsPerPage);
  }, []);

  const gotoPage = (pageNo: number | string) => {
    if (typeof pageNo === "string") {
      pageNo = Number(pageNo);
    }
    if (isNaN(pageNo) || pageNo < 1) return;

    propsHandlePagination(rowSize, pageNo);
    setJumpPage("");
  };

  const totalPage = propsPagination.totalPage || 0;

  useEffect(() => {
    if (propsPagination.totalPage === 0 || (propsPagination.totalPage === propsPagination.pageNo && propsPagination.totalPage <= 1)) {
      setDisabled({ val: true, cursor: "not-allowed" });
    } else {
      setDisabled({ val: false, cursor: "" });
    }
  }, [propsPagination]);

  const handleJumpPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "") {
      setJumpPage("");
      return;
    }
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    setJumpPage(numValue > totalPage ? totalPage : numValue);
  };

  return (
    <div className={propsClasses} style={{ margin: "16px 8px 16px 8px" }}>
      {totalPage !== 0 ? (
        <Row>
          <Col className={CSSpagination.risebot_showingOutOfCol} md={2}>
            <span className={CSSpagination.risebot_label}>
              Page {propsPagination.pageNo} of {totalPage}
            </span>
          </Col>
          <Col md={4} className={CSSpagination.risebot_paginationCol}>
            {!(propsPagination.pageNo === 1 && propsPagination.pageNo === propsPagination.totalPage) && (
              <PaginationItemsComponent
                disabled={disabled}
                gotoPage={gotoPage}
                totalPage={totalPage}
                rowSizeData={rowSizeData}
                propsPagination={propsPagination}
                marginPages={marginPages}
              />
            )}
          </Col>
          <Col className={CSSpagination.risebot_goToPageCol} md={3}>
            {!(propsPagination.pageNo === 1 && propsPagination.pageNo === propsPagination.totalPage) && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
                <div className="risebot_label1_div">
                  <span className={CSSpagination.risebot_label1}> Go to page </span>
                </div>

                <input
                  id="inputPageNo"
                  type="number"
                  min="1"
                  max={Number(totalPage) || Number("2")}
                  className={`${CSSpagination.risebot_textBox} go-input`}
                  style={{ cursor: disabled.cursor, border: "1px solid red" }}
                  size={5}
                  value={jumpPage}
                  onChange={handleJumpPageChange}
                  placeholder={enterPlaceholderText}
                  disabled={disabled.val}
                />
                <div
                  id="btn"
                  data-testid="btn"
                  role="button"
                  tabIndex={0}
                  className={`${CSSpagination.risebot_buttonBox} go-button`}
                  onKeyUp={() => false}
                  onClick={() => gotoPage(jumpPage)}
                >
                  GO
                </div>
              </div>
            )}
          </Col>
          <Col className={CSSpagination.risebot_recordsPerPageCol} md={3} data-testid="test-col">
            <Dropdown
              id="pageNo"
              testidMain="pageNo"
              cnameToggleTitle={CSSpagination.risebot_customDropdownTitle}
              value={limit.toString()}
              handleChange={(e: string) => handleRowData(e)}
              data={rowSizeData}
            />
          </Col>
        </Row>
      ) : null}
    </div>
  );
}

export default Pagination;


import React, { useState, useEffect, useMemo } from "react";
import { Typography } from "@mui/material";
import SubHeader from "../../components/planning/SubHeader.component";
import Sidebar from "../../components/planning/Sidebar.component";
import "./users.css";
import Search from "../../components/ui/search/Search.component";
import { toast } from "react-toastify";
import {
  DATA_ASSET_HEADERS_USERS_LIST,
  TOAST_MESSAGES,
  UI_TEXTS,
} from "../../components/common/Constants/label-contants";
import CustomPagination from "../../components/common/CustomPagination/CustomPagination";
import { getUsersList } from "../../services/configurations/configService";
import GlobalTable from "../../components/common/GlobalTable/GlobalTable";
import { formattedDate } from "../../utils/CommonUtils";
import { isLoadingInHost } from "../../utils/DetectHost";
import debounce from "lodash.debounce"; // or write your own debounce

function Users() {
  const [sidebarActiveTab, setSidebarActiveTab] = useState("users");
  const [pageLoader, setPageLoader] = useState(false);
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 25,
    totalItems: 0,
    totalPages: 0,
  });
  const [allRows, setAllRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        // Always fetch page 1 when search changes
        fetchUsers(1, pagination.itemsPerPage, value);
      }, 500),
    [pagination.itemsPerPage]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const filterRows = (data, searchValue) => {
    if (!searchValue.trim()) return data;

    const lowerSearch = searchValue.toLowerCase();
    return data.filter(
      (row) =>
        (row.name && row.name.toLowerCase().includes(lowerSearch)) ||
        (row.email && row.email.toLowerCase().includes(lowerSearch))
    );
  };

  const getRowId = (row) => row.userId;

  const transformUserData = (apiData) => {
    return apiData.map((user) => ({
      sub: user.userId,
      name: user.name,
      jnjMSUsername: user.username,
      email: user.email,
      memberOf: user.memberOf,
      address: {
        country: "-",
        region: "-",
      },
      loggedInAt: user.loginTime,
      loggedOutAt: user.loggedOutAt,
      isLoggedIn: user.isLoggedIn,
      loginType: "-",
      userId: user.userId,
      roles: user.roles,
    }));
  };

  const fetchUsers = async (pageNo = 1, pageSize = 25, search = "") => {
    setPageLoader(true);
    try {
      const response = await getUsersList({ pageNo, pageSize, search });
      if (response?.flag === "success") {
        const transformedData = transformUserData(response.data || []);
        setAllRows(transformedData);
        // if (searchText) {
        //   setFilteredRows(filterRows(transformedData, searchText));
        // } else {
        setFilteredRows(transformedData);
        // }
        setPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalItems: response.pagination?.totalCount || 0,
          totalPages: response.pagination?.totalPage || 1,
          itemsPerPage: response.pagination?.limit || pageSize,
        });
      } else {
        toast.error(response?.message || TOAST_MESSAGES.ERROR.FETCH, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(error.message || TOAST_MESSAGES.ERROR.FETCH, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      console.error("Error fetching users:", error);
    } finally {
      setPageLoader(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.currentPage, pagination.itemsPerPage);
  }, []);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    fetchUsers(newPage, pagination.itemsPerPage, searchText);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    fetchUsers(1, newItemsPerPage, searchText);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    debouncedSearch(value);
    // if (value) {
    //   setFilteredRows(filterRows(allRows, value));
    // } else {
    //   setFilteredRows(allRows);
    // }
  };

  const renderCell = (row, key) => {
    const value = row[key];

    if (key === "memberOf") {
      if (!value || value.length === 0) return "-";
      return (
        <div className="tag-view-container">
          {value.map((tag, i) => (
            <span key={i} className="tag">
              {tag}
            </span>
          ))}
        </div>
      );
    }

    if (key === "isLoggedIn") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: value ? "green" : "gray",
              marginRight: 8,
            }}
          ></span>
          {value ? UI_TEXTS.HEADINGS.ACTIVE : UI_TEXTS.HEADINGS.OFFLINE}
        </div>
      );
    }

    if (key === "address") {
      return (
        <div>
          {`Country: ${
            value?.country === "" ? "-" : value?.country ?? "-"
          }, Region: ${value?.region === "" ? "-" : value?.region ?? "-"}`}
        </div>
      );
    }

    if (key === "loggedInAt" || key === "loggedOutAt") {
      return value ? formattedDate(value) : "-";
    }

    return value || "-";
  };

  return (
    <div>
      <SubHeader />
      <div style={{ display: "flex", height: "88vh" }}>
        <Sidebar
          activeTab={sidebarActiveTab}
          setActiveTab={setSidebarActiveTab}
        />
        <div style={{ padding: "7px 11px 0 11px", width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Typography className="users-title">
              {!isLoadingInHost ? UI_TEXTS.HEADINGS.USERS : ""}
            </Typography>
            <div style={{ display: "flex", gap: "10px" }}>
              <Search
                placeholder="Search..."
                searchIconTowardsRight
                selection="single"
                handleSearchText={handleSearch}
                setSearchTextProp={setSearchText}
              />
            </div>
          </div>

          <GlobalTable
            headers={DATA_ASSET_HEADERS_USERS_LIST}
            data={filteredRows}
            pageLoader={pageLoader}
            rowsPerPage={pagination.itemsPerPage}
            page={pagination.currentPage - 1}
            totalRows={pagination.totalItems}
            onPageChange={(e, newPage) => handlePageChange(newPage + 1)}
            onRowsPerPageChange={handleItemsPerPageChange}
            renderCell={renderCell}
            hideFooter={true}
            getRowId={getRowId}
          />

          <CustomPagination
            currentPage={pagination.currentPage}
            setCurrentPage={handlePageChange}
            itemsPerPage={pagination.itemsPerPage}
            setItemsPerPage={handleItemsPerPageChange}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
          />
        </div>
      </div>
    </div>
  );
}

export default Users;

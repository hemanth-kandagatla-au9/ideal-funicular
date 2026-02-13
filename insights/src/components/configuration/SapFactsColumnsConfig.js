import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSapFactsColumns, getUserConfigurations, syncSAPFactsCloumns, updateSapFactsColumns } from "../../services/jobs/JobsService";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { toast } from "react-toastify";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import { hasInsightsPermission, PERMISSION_LIST } from "../../utils/permissionUtil";
import { Tooltip } from "@mui/material";
import CustomizedSwitches from "../common/Button/CustomSwitch";
import { getUsernameFromCookies } from "../../utils/cookieUtility";

const SapFactsColumnsConfig = ({ isSidebarExpanded }) => {
    const sapFactsColumnsList = useSelector((state) => state.jobs.sapFactsColumnsConfig.data) || [];
    const permissionState = useSelector((state) => state.jobs?.permissions);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);

    const fetchSAPFactsColumnsConfigs = async () => {
        try {
            setLoading(true);
            await dispatch(getSapFactsColumns());
            // setSapFactsColumns(response.data.data);
        } catch (error) {
            toast.error(error.message || TOAST_MESSAGES.ERROR.FETCH, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        } finally {
            setLoading(false);
        }
    }

    const getRowId = (row) => {
        return row.id;
    };

    const handleColumnToggle = async (newStatus, rowData) => {
        setIsStatusUpdating(true);
        try {
            const payload = {
                source: rowData.source,
                category: rowData.category,
                columnName: rowData.columnName,
                active: newStatus,
                updatedBy: getUsernameFromCookies(),
            };

            const response = await updateSapFactsColumns(payload);

            if (response && response.success) {
                toast.success(
                    `SAP Fact column ${newStatus ? "activated" : "deactivated"} successfully`
                );
                dispatch(getSapFactsColumns());
            } else {
                throw new Error(response?.message || "Failed to update job status");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsStatusUpdating(false);
        }
    };

    const rows = sapFactsColumnsList.map((col, index) => ({
        ...col,
        id: `col-${index}`,
        index: index,
    }));

    console.log("sapFactsColumnsList => ", sapFactsColumnsList);

    const columns = [
        {
            field: "index",
            headerName: "#",
            flex: 0.5,
            headerAlign: "center",
            renderCell: (params) => (
                <div style={{ textAlign: "center" }}>{params.row.index + 1}</div>
            ),
        },
        {
            field: "source",
            headerName: UI_TEXTS.TABLE_TEXTS.SOURCE,
            flex: 2,
            renderCell: (params) => <div>{params.row.source}</div>,
        },
        {
            field: "category",
            headerName: UI_TEXTS.TABLE_TEXTS.CATEGORY,
            flex: 2,
            renderCell: (params) => <div>{params.row.category}</div>,
        },
        {
            field: "columnName",
            headerName: UI_TEXTS.TABLE_TEXTS.COLUMN_NAME,
            flex: 2,
            renderCell: (params) => <div>{params.row.columnName}</div>,
        },
        hasInsightsPermission(
            permissionState,
            "SAP Facts Columns",
            PERMISSION_LIST.SAP_FACTS_COLUMNS_READ
        ) &&
        hasInsightsPermission(
            permissionState,
            "SAP Facts Columns",
            PERMISSION_LIST.SAP_FACTS_COLUMNS_WRITE
        ) && {
            field: "actions",
            headerName: UI_TEXTS.TABLE_TEXTS.ACTION,
            flex: 1,
            headerAlign: "center",
            renderCell: (params) => (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                    <Tooltip
                        title={
                            params.row.active
                                ? UI_TEXTS.TOOLTIP_TEXT.SHOW_COLUMN
                                : UI_TEXTS.TOOLTIP_TEXT.HIDE_COLUMN
                        }
                        placement="bottom"
                    >
                        <div>
                            <CustomizedSwitches
                                isActive={
                                    params.row.active === true
                                }
                                onToggle={(newStatus) =>
                                    handleColumnToggle(newStatus, params.row)
                                }
                            />
                        </div>
                    </Tooltip>
                </div>
            ),
        },
    ].filter(Boolean);

    useEffect(async () => {
        await syncSAPFactsCloumns();
        fetchSAPFactsColumnsConfigs();
    }, [dispatch]);

    return (
        <>
            <div
                style={{
                    flex: 1,
                    overflow: "auto",
                    position: "relative",
                    maxWidth: isSidebarExpanded ? "86vw" : "95vw",
                }}
            >
                {loading && (
                    <div className="grid-loader">
                        <div className="loader-spinner"></div>
                    </div>
                )}
                <CustomDataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    rowCount={rows.length}
                    paginationMode="client"
                    sortingMode="client"
                    rowCursorPointer={true}
                    hideFooter={false}
                    tableHeight="55vh"
                    loading={isStatusUpdating || loading}
                    showColumnFilters={false}
                />
            </div>
        </>
    )
}

export default SapFactsColumnsConfig;
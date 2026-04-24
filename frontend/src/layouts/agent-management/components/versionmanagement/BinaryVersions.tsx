/* eslint-disable no-shadow */
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, Spin } from "antd";

import { getVersions, isVersionManagementLoading, getVersionError, isCreateVersionLoading, getCreateVersionError, isManualSyncVersionsLoading } from "../../../../redux/selectors/agentManagement.selectors";
import agentManagementActions from "../../../../redux/actions/agentManagement.action";
import BinaryVersionsModal from "./BinaryVersionsModal";
import { BinaryVersion } from "./binarytypes";
import BinaryVersionsHeader from "./BinaryVersionsHeader";
import BinaryVersionsTable from "./BinaryVersionsTable";
import BinaryFilterBar from "./BinaryFilterBar";


const BinaryVersions = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editingVersion, setEditingVersion] = useState<BinaryVersion | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [versions, setVersions] = useState<BinaryVersion[]>([]);
  const [filteredVersions, setFilteredVersions] = useState<BinaryVersion[]>([]);
  const [filters, setFilters] = useState({
    os: [] as string[],
    versions: [] as string[],
    types: [] as string[],
  });
  const osOptions = ["windows", "linux"];
  const typeOptions = ["Mandatory", "Optional"];
  const dispatch = useDispatch();
  const reduxResponse: any = useSelector(getVersions);
  const versionOptions = useMemo(() => {
    const filterData = reduxResponse?.data?.data?.filterData;
    const availableFromApi = filterData?.agentVersions ?? filterData?.availableVersions;

    if (Array.isArray(availableFromApi) && availableFromApi.length > 0) {
      return [...new Set(availableFromApi.map(String))].sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true }));
    }

    const uniqueVersions = [...new Set(versions.map(version => version.version))];
    return uniqueVersions.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [reduxResponse, versions]);
  const loading = useSelector(isVersionManagementLoading);
  const error = useSelector(getVersionError);
  const createVersionLoading = useSelector(isCreateVersionLoading);
  const createVersionError = useSelector(getCreateVersionError);
  const manualSyncLoading = useSelector(isManualSyncVersionsLoading);
  const [paginationFilters, setPaginationFilters] = useState({
    versionStatus: [""],
    page: 1,
    limit: 10,
  });
  useEffect(() => {
    if (filters.os.length > 0 || filters.types.length > 0 || filters.versions.length > 0) {
      setPaginationFilters(prev => ({
        ...prev,
        page: 1,
      }));
    }
  }, [filters]);
  useEffect(() => {
    const apiParams: any = {
      ...paginationFilters,
    };
    if (filters.os.length > 0) {
      apiParams.operatingSystem = filters.os.join(',');
    }
    if (filters.types.length > 0) {
      apiParams.upgradeType = filters.types.join(',');
    }
    if (filters.versions.length > 0) {
      apiParams.agentVersion = filters.versions.join(',');
    }

    dispatch(agentManagementActions.fetchVersions(apiParams));
  }, [dispatch, paginationFilters, filters]);
  useEffect(() => {
    if (reduxResponse?.data?.data?.versionData) {
      const formattedVersions = reduxResponse.data.data.versionData.map((version: any) => {
        const osCompatibilityArr = Array.isArray(version.compatibleOS)
          ? version.compatibleOS.map(os => (typeof os === "string" ? os : `${os.agentType || ""} ${os.osVersion || ""}`))
          : [];
        return {
          id: version._id,
          version: version.agentVersion,
          buildDate: version.buildDate || "N/A",
          buildDateDisplay: version.buildDate ? new Date(version.buildDate).toLocaleDateString() : "N/A",
          osCompatibility: osCompatibilityArr.length > 0 ? osCompatibilityArr : ["-"],
          osEntries: Array.isArray(version.compatibleOS)
            ? version.compatibleOS.map(os => (typeof os === "string" ? { os, version: "" } : { os: os.agentType || "", version: os.osVersion || "" }))
            : [],
          upgradeType: version.upgradeType || "",
        };
      });
      setVersions(formattedVersions);
    } else {
      setVersions([]);
    }
  }, [reduxResponse]);
  useEffect(() => {
    setFilteredVersions(versions);
  }, [versions]);
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (createVersionError) {
      message.error(createVersionError);
    }
  }, [createVersionError]);

  const handleAddBinaryVersion = async (newVersion: Omit<BinaryVersion, "id">) => {
    try {
      const payload = {
        agentVersion: newVersion.version,
        compatibleOS: newVersion.osEntries.map(entry => ({
          agentType: entry.os.toLowerCase(),
          osVersion: entry.version,
        })),
        versionStatus: newVersion.status,
        upgradeType: newVersion.upgradeType, // Keep original case
        releaseDate: new Date(newVersion.releaseDate).toISOString(),
        buildDate: new Date(newVersion.releaseDate).toISOString(),
        rustcversion: newVersion.rustcversion,
        agentpath: `${newVersion.osEntries[0]?.os.toLowerCase()}/risebot_${newVersion.version}`,
        s3Url: newVersion.s3Url,
        createdBy: "userName",
      };
      const result = await dispatch(agentManagementActions.createVersion(payload));
      if (result && !createVersionError) {
        setOpenModal(false);
        setEditingVersion(null);
        dispatch(
          agentManagementActions.fetchVersions({
            ...paginationFilters,
            osFilters: filters.os,
            versionFilters: filters.versions,
            typeFilters: filters.types,
          }),
        );
      }
    } catch (error) {
      console.error("Failed to create version:", error);
    }
  };

  const handleUpdateBinaryVersion = async (updatedVersion: Omit<BinaryVersion, "id">) => {
        console.log("Updating version:", updatedVersion);

    if (!editingVersion?.id) {
      message.error("No version selected for update");
      throw new Error("No version selected for update");
    }

    try {
      const payload = {
        agentVersion: updatedVersion.version,
        compatibleOS: updatedVersion.osEntries.map(entry => ({
          agentType: entry.os.toLowerCase(),
          osVersion: entry.version,
        })),
        upgradeType: updatedVersion.upgradeType,
        createdBy: "userName",
      };
      const result = await dispatch(agentManagementActions.updateVersion(payload, updatedVersion.id));
      if (result) {
        setOpenModal(false);
        setEditingVersion(null);
        dispatch(
          agentManagementActions.fetchVersions({
            ...paginationFilters,
            osFilters: filters.os,
            versionFilters: filters.versions,
            typeFilters: filters.types,
          }),
        );
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Failed to update version:", error);
      throw error; // Re-throw to let modal know update failed
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPaginationFilters({ ...paginationFilters, page, limit: pageSize });
  };

  const handleSync = () => {
    dispatch(agentManagementActions.manualSyncVersions());
  };

  const handleView = (version: BinaryVersion) => {
    setEditingVersion(version);
    setIsViewMode(true);
    setOpenModal(true);
  };

  const handleEdit = (version: BinaryVersion) => {
    setEditingVersion(version);
    setIsViewMode(false);
    setOpenModal(true);
  };
  console.log(reduxResponse?.data?.data?.pagination?.total,"reduxResponse?.data?.data?.pagination?.total")

  return (
    <div style={{ padding: 12, fontFamily: 'Johnson Text !important' }}>
      <Spin spinning={loading || createVersionLoading || manualSyncLoading}>
        <BinaryVersionsHeader 
          versionsCount={reduxResponse?.data?.data?.pagination?.total || 0} 
          onSync={handleSync} 
          isLoading={manualSyncLoading} 
        />

        <BinaryFilterBar osOptions={osOptions} versionOptions={versionOptions} typeOptions={typeOptions} filters={filters} setFilters={setFilters} />

        <BinaryVersionsTable
          versions={filteredVersions}
          pagination={{
            current: paginationFilters.page,
            pageSize: paginationFilters.limit,
            total: reduxResponse?.data?.data?.pagination?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: true,
          }}
          onView={handleView}
          onEdit={handleEdit}
        />

        <BinaryVersionsModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditingVersion(null);
            setIsViewMode(false);
          }}
          handleAddBinaryVersion={handleAddBinaryVersion}
          handleUpdateBinaryVersion={handleUpdateBinaryVersion}
          editingVersion={editingVersion}
          isViewMode={isViewMode}
        />
      </Spin>
    </div>
  );
};

export default BinaryVersions;

import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./GridPopup.module.scss";
import { CheckCircle2, Search } from "lucide-react";
import { hasPermission } from "../../utils/permissionUtil";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface GridDropdownProps {
  apps: { id: string; name: string; icon: React.ReactNode; route: string, project: string, module: string }[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onClose: () => void;
  maxSelected?: number;
  setOpenon: () => void;
}

const GridDropdown: React.FC<GridDropdownProps> = ({
  apps,
  selectedIds,
  onToggleSelect,
  onClose,
}) => {
  const permissions = useSelector((state: RootState) => state?.permissions?.permissions);
  const { loaded } = useSelector((state: RootState) => state?.permissions);
  const history = useHistory();
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  console.log("permissions ============== = ",permissions)
  const filteredApps = useMemo(() => {
    if (!searchTerm.trim()) return apps;
    const term = searchTerm.toLowerCase();
    return apps.filter((app) => app.name.toLowerCase().includes(term));
  }, [apps, searchTerm]);
  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className={styles.searchField}
          />
        </div>
      </div>
      <p className={styles.iconpara}>
        Pin up to 3 menu items to the top. Drag to rearrange their order.
      </p>

      <div className={styles.dropdown}>
        {filteredApps.length === 0 ? (
          <div className={styles.noResults}>No apps found</div>
        ) : (
          filteredApps.map((app) => {
            // Debug logging
            const hasAccess = hasPermission(permissions, app?.project, app?.module);
            console.log(`Checking permission for ${app.name}:`, {
              project: app?.project,
              module: app?.module,
              loaded,
              hasAccess,
              permissionsLength: permissions?.length || 0
            });
            
            // Only filter if permissions are loaded
            if (loaded && !hasAccess) {
              console.log(`❌ Filtering out ${app.name} - no permission`);
              return null;
            }
            
            console.log(`✅ Showing ${app.name}`);
            const isSelected = selectedIds.includes(app.id);
          const isHovered = hovered === app.id;

            return (
              <div
                key={app.id}
                className={styles.appItem}
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Navigation icon */}
                <div
                  className={styles.iconBox}
                  onClick={() => {
                    onClose();
                    history.push(app.route);
                  }}
                >
                  {app.icon}
                </div>

                {/* Pin toggle circle */}
                {(isHovered || isSelected) && (
                  <button
                    className={`${styles.pinButton} ${isSelected ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(app.id);
                    }}
                  >
                    {isSelected && <CheckCircle2 size={16} />}
                  </button>
                )}

                <div
                  className={styles.label}
                  onClick={() => {
                    onClose();
                    history.push(app.route);
                  }}
                >
                  {app.name}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GridDropdown;

import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './GridPopup.module.scss';
import { CheckCircle2, Search } from 'lucide-react';
import { hasPermission } from '../../utils/permissionUtil';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface GridDropdownProps {
  apps: {
    id: string;
    name: string;
    icon: React.ReactNode;
    route: string;
    project: string;
    module: string;
    openInNewWindow?: boolean;
  }[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onClose: () => void;
  setOpenon?: () => void;
  maxSelected?: number;
}

const GridDropdown: React.FC<GridDropdownProps> = ({
  apps,
  selectedIds,
  onToggleSelect,
  onClose,
}) => {
  const history = useHistory();
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const permissions = useSelector((state: RootState) => state.permissions?.permissions);
  const loaded = useSelector((state: RootState) => state.permissions?.loaded);

  const visibleApps = useMemo(() => {
    if (!loaded || !Array.isArray(permissions)) return [];

    const term = searchTerm.trim().toLowerCase();

    return apps.filter((app) => {
      const matchesSearch = !term || app.name.toLowerCase().includes(term);

      const hasAccess = hasPermission(permissions, app.project, app.module);

      return matchesSearch && hasAccess;
    });
  }, [apps, searchTerm, permissions, loaded]);

  const navigateToApp = (app: any) => {
    onClose();
    if (app.openInNewWindow === true) {
      window.open(
        process.env.IACRYPT_URL || 'https://predev.iacrypt.ias.apps.jnj.com/',
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      history.push(app.route);
    }
  };

  return (
    <div className={styles.dropdownContainer}>
      {/* Search */}
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

      {/* Content */}
      <div className={styles.dropdown}>
        {!loaded ? (
          <div className={styles.noResults}>Loading permissions…</div>
        ) : visibleApps.length === 0 ? (
          <div className={styles.noResults}>No apps found</div>
        ) : (
          visibleApps.map((app) => {
            const isSelected = selectedIds.includes(app.id);
            const isHovered = hovered === app.id;

            return (
              <div
                key={app.id}
                className={styles.appItem}
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* App Icon */}
                <div className={styles.iconBox} onClick={() => navigateToApp(app)}>
                  {app.icon}
                </div>

                {/* Pin Button */}
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

                {/* Label */}
                <div className={styles.label} onClick={() => navigateToApp(app)}>
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

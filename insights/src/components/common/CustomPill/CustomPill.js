import { Edit } from "iconsax-react";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import "../CustomFilters/CustomFilters.css"
  
  const CustomPill = ({
    key,
    value,
    type = "",
    closeFun = () => { },
    onEditFun = () => { },
    editOption = false,
    showCloseIcon = false,
    showIcon = true,
    cssClass = "",
    deleteConfirmation = false,
  }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
  
   
  
    const closeConfirmModal = () => {
      setShowConfirmModal(false);
    };
  
    const saveConfirmModal = () => {
      setShowConfirmModal(false);
      closeFun();
    };
    return (
      <>
        <span key={key} className={`selected_filters_tag ${cssClass}`}>
          {showIcon && type !== "CustomServerFilter"}
          {value}
          {editOption && (
            <div
              onClick={onEditFun}
              style={{ display: "inline-block", cursor: "pointer" }}
            >
              <Edit size={12} color="black" />
            </div>
          )}
          {showCloseIcon && (
            <div
              onClick={() => {
                deleteConfirmation ? setShowConfirmModal(true): closeFun();         
              }}
              style={{ display: "inline-block", cursor: "pointer" }}
            >
              <RxCross2
                className="svg-bg-fill cursor_pointer"
                pathClassName="svg-path-fill"
              />
            </div>
          )}
        </span>
      </>
    );
  };
  
  export default CustomPill;
  
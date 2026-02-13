import React, { useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

import "./paginate.css"
import { UI_TEXTS } from '../../common/Constants/label-contants';

const Paginate = (props) => {
    const {currentPage,setCurrentPage,itemsPerPage,setItemsPerPage,totalPages,pageInput,setPageInput,ModalStyling} = props
   
    const handleChangePage = (e, newValue) => {
    setCurrentPage(newValue)
    setPageInput("")
    };
    const handlePageInput = (e) => {
        if (e.target.value === "" || !isNaN(e.target.value)) {
            setPageInput(e.target.value)
        }

    };

    const handlePageSearch = (e) => {
    setCurrentPage(parseInt(pageInput, 10))
    setPageInput(parseInt(pageInput, 10))

    };

    const handleRecordsChange = (e) => {
    setItemsPerPage(e.target.value)
   setPageInput("")
    setCurrentPage(1)
    }

    useEffect(()=>{
        if(totalPages<currentPage){
            setCurrentPage(1)
        }
        if(totalPages===0){
            setCurrentPage(0)
        }
    },[totalPages])
   


    return (
        <>
            <div className={ModalStyling?"pagination-container-modal":"pagination-container"}
             >

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', width: '100%', alignItems: 'center'}}>
                    <div style={{ fontSize: '14px' }}>Showing <span className="jobs-current-page-styling">{currentPage} of </span>{totalPages} page(s)</div>
                    <div style={{ marginLeft: '30px' }}>
                        <Stack spacing={2}>
                            <Pagination color="primary" onChange={handleChangePage} page={currentPage} count={totalPages} defaultPage={currentPage}/>
                        </Stack>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', width: '100%', alignItems: 'center',marginRight:ModalStyling?"40px":"0px"  }}>
                    <div style={{ marginRight: '10px' }} className="page-search">
                        <div style={{ fontSize: '14px' }}>{UI_TEXTS.BUTTONS.GO_TO_PAGE}</div>
                        <div className="page-search-1">
                            <input className="s-inp" value={pageInput} onChange={handlePageInput} placeholder={UI_TEXTS.PLACEHOLDERS.ENTER} />
                            <button onClick={handlePageSearch} className="s-btn" disabled={pageInput > totalPages || pageInput < 1 ? true : false}>{UI_TEXTS.BUTTONS.GO_BUTTON}</button>
                        </div>
                    </div>

                    <div>|</div>

                    <div style={{ fontSize: '14px', margin: '0px 10px' }}>{UI_TEXTS.LABELS.RECORDS_PER_PAGE}</div>
                    <div className="select-page">
                        <Select value={itemsPerPage} className="jobs_records_pagination"
                            onChange={(e) => handleRecordsChange(e)}
                        >
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="20">20</MenuItem>
                            <MenuItem value="30">30</MenuItem>
                        </Select>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Paginate

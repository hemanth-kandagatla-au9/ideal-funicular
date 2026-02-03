import createSelector from "@reduxjs/toolkit";

const selectSelf = state => state;

export const dataSelector = createSelector(selectSelf, state => state);

export default dataSelector;

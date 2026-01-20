export function MultiSelectDropdownWithFilter({ callback, getFilterOption }) {
  return (
    <div data-testid="handleMultiSelect">
      <div>
        This is a mocked MultiSelectComponent
        <button type="button" data-testid="getFilterOption" onClick={getFilterOption}>
          get List of Option
        </button>
        <button type="button" data-testid="callback" onClick={callback}>
          Apply click callback
        </button>
      </div>
    </div>
  );
}

export default MultiSelectDropdownWithFilter;

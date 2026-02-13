import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { frequencyMapping, frequencyMapping_WithLabels } from '../common/Constants/constantObjects';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            // width:240,
        },
    },
};

export default function CronMultiSelect({
    labelName,
    options,
    placeHolderText,
    onChange,
    value,
    isDisabled,
    isMultiSelect = false,
    isRequired = false,
    labelsforUI = false,
    scheduleType = ""
}) {

    let updatedOption = options;
    let updatedValue = value;
    if (labelsforUI === true) {
        updatedValue = [frequencyMapping[`${value}`]]
        updatedOption = frequencyMapping_WithLabels
    }
    return (

        <FormControl className='custom-input-wrapper' style={{ width: '100%' }} disabled={isDisabled}>
            {labelName && (
                <label className='custom-label'>
                    {labelName} <span style={{ color: 'red' }}>{isRequired ? "*" : ''}</span>
                </label>
            )}
            <Select
                id='css-select-dropdown'
                multiple={isMultiSelect}
                value={updatedValue}
                onChange={(e) => {
                    const val = e.target.value;
                    onChange(val);
                }}
                renderValue={(selected) => {
                    if (scheduleType === "STARTUP" || scheduleType === "AD_HOC") {
                        return ""
                    }
                    if (selected[0] === '*' || (selected.length === 1 && selected[0] === '')) {
                        return <>{placeHolderText}</>;
                    }
                    selected = selected.filter(val => val !== '')
                    return selected?.join(", ");
                }}
                MenuProps={MenuProps}
            >
                <MenuItem disabled value="">
                    <>{placeHolderText}</>
                </MenuItem>
                {updatedOption.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        <Checkbox
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleIcon />}
                            checked={value?.indexOf(option.value) > -1}
                        />
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

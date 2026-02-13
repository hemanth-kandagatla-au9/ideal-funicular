import { IconButton, Stack } from '@mui/material';
import './Button.css';


const Button = ({ onClick, children, type,disabled=false,className="" }) => {
    return (
        <IconButton
            sx={{ borderRadius: '0' }}
            className={`${type === 'primary' ? 'primary-btn' : type === 'secondary' ? 'secondary-btn' : 'tertiary-btn'} ${className}`}

            onClick={onClick}
            disabled={disabled}
        >
            <Stack direction={'row'} alignItems={'center'} gap={1} fontSize={16} fontWeight={600} fontFamily={"Manrope-semibold"}>
                {children}
            </Stack>
        </IconButton>
    );
};

export default Button;


import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'block',
    padding: '20px',
};

export const CustomModal = ({ open, onClose, children, header }) => {
    return (

        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', paddingBottom: '10px' }}>
                    <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div style={{ padding: '0 2rem' }}>
                    {children}
                </div>
            </Box>
        </Modal>)
}

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const ConfirmDialog = ({ open, onConfirm, onCancel, title = "Подтверждение навигации", message = "Вы уверены, что хотите перейти на предыдущую страницу?" }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Да, перейти
        </Button>
        <Button onClick={onCancel} color="secondary" variant="outlined">
          Остаться
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 
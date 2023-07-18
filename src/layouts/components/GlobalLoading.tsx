import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '~/store';
import { useTranslation } from 'next-i18next';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  p: 4,
  outline: 'none'
};
export default function Loading() {
  const { t } = useTranslation(['common']);
  const open = useAppSelector((state) => state.globalLoading.loading);

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="global-loading" sx={style}>
          <CircularProgress />
          <Typography variant="body2" textAlign="center">{t('common:loading')}</Typography>
        </Box>
      </Modal>
    </>
  );
};
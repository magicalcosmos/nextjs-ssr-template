import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

export type TBaseDialogProps = {
  t: Function;
  title?: string;
  dialogClass?: string;
  open?: boolean;
  contentBody?: any;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  onCancel?: Function;
  onConfirm?: Function;
  onClose?: () => void;
};

const BaseDialog = (props: TBaseDialogProps) =>  {
  const {
    t,
    title = t('common:tip-title'),
    dialogClass = '',
    open = false,
    contentBody = '',
    showCancelButton = true,
    showConfirmButton = true,
    cancelText,
    confirmText,
    onCancel = () => {},
    onConfirm = () => {},
    onClose = () => {}
  } = props;

  return (
    <>
      <Dialog
        className={`base-dialog ${dialogClass}`}
        fullWidth={false}
        maxWidth={false}
        open={open}
        onClose={onClose}
      >
        <DialogTitle className="base-dialog-header">
          {title}

          <IconButton
            aria-label="close"
            onClick={() => { onClose()}}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <i className="icon icon-close"/>
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText component={'div'}>
            {contentBody}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          { showCancelButton && <Button className="base-dialog-operate base-dialog-cancel" variant="outlined" onClick={() => {onCancel()}}>{cancelText || t('common:cancel')}</Button> }
          { showConfirmButton && <Button className="base-dialog-operate base-dialog-confirm" variant="contained" onClick={() => {onConfirm()}}>{confirmText || t('common:sure')}</Button> }
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BaseDialog;
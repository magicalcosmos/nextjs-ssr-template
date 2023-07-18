import { useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

export type TMessageProps = {
  content: string | React.ReactElement;
  duration?: number;
  type?: AlertColor | undefined;
};
export default function Message(props: TMessageProps) {
  const { content, duration, type } = {...props};
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Snackbar 
    open={open} 
    autoHideDuration={duration} 
    anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
    onClose={handleClose}
    >
      <Alert severity={type} variant="standard">
        {content}
      </Alert>
    </Snackbar>
  );

}
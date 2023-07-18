type TOption = {
  label: string;
  value: string;
};

type TBaseDialogProps = {
  t: Function;
  title: string;
  dialogClass: string;
  open: boolean;
  contentBody: any;
  showCancelButton: boolean;
  showConfirmButton: boolean;
  cancelText?: string;
  confirmText?: string;
  onCancel: Function;
  onConfirm: Function;
  onClose: Function;
};

type TPagination = {
  total: number,
  page: number,
  perPage: number
};
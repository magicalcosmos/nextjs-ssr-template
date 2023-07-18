import BaseDialog from '~/layouts/components/BaseDialog';

type TDeletLicenseProps = {
  t: Function;
  open: boolean;
  onClose: Function;
  onConfirm: Function;
}

export default function DeleteLicense({ t, open, onClose, onConfirm }: TDeletLicenseProps) {

  /**
   * handle confirm
   */
  const handleConfirm = () => {
    onConfirm();
  };

  /**
   * close dialog
   */
  const handleCloseDialog = () => {
    onClose();
  }

  return (
    <>
    <BaseDialog
      t={t}
      dialogClass="tip-base-dialog"
      title={t('common:tip-title')}
      open={!!open}
      onCancel={handleCloseDialog}
      onClose={handleCloseDialog}
      onConfirm={handleConfirm}
      contentBody={
        <>
          <i className="icon icon-warning"></i>
          <span className="warning-text">{t('sys-licenses:delete-license-tips')}</span>
        </>
      } />
    </>
  );
};
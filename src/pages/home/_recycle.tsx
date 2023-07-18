// 回收证书
import BaseDialog from '~/layouts/components/BaseDialog';
import { useState } from 'react';
import { $api } from '~/api';
// 分发证书
  
export default function Assign({ t, visible, license, setShowDialog, reload }: IHomeProps) {

  const [recycleCode, setRecycleCode] = useState<string|undefined>(undefined);

  const handleRecycleCodeInput =  (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRecycleCode(event.target.value);
  };

  const handleRecycleConfirm = () => {
    if (recycleCode === undefined) {
      setRecycleCode('');
      return;
    }
    $api.license.recycle({
      licenseId: license.id,
      recycleCode,
    }).then(() => {
      setShowDialog(false);
      typeof reload === 'function' && reload();
    }).catch(() => {});
  };
  return (
    <BaseDialog
      t={t}
      dialogClass="home-dialog update-recycle"
      title={t('operation.recycle')}
      open={!!visible}
      onCancel={() => setShowDialog(false)}
      onClose={() => setShowDialog(false)}
      onConfirm={handleRecycleConfirm}
      contentBody={<ul className="home-dialog-list">
        <li className={`home-dialog-item ${recycleCode === '' ? 'no-empty' : ''}`}>
          <label><span className="required">*</span>{t('recycle_code')}</label>
          <textarea 
            placeholder={t('placeholder.input_recycle_code')} 
            onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleRecycleCodeInput(e)}
          ></textarea>
        </li>
      </ul>}></BaseDialog>
  );
}
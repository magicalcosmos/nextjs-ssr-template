import BaseDialog from '~/layouts/components/BaseDialog';
import DatePickerBox from '~/layouts/components/DatePickerBox';
import {  
  Checkbox,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { $api } from '~/api';
import dayjs, { Dayjs } from 'dayjs';

// 分发证书
  
export default function Assign({ t, visible, license, setShowDialog, reload }: IHomeProps) {
  const [ owner, setOwner ] = useState<string|undefined>(undefined);
  const [ machineCode, setMachineCode ] = useState<string|undefined>(undefined);
  const [ comment, setComment ] = useState<string|undefined>('');
  const [ checked, setChecked ] = useState(true);
  const [ autoRecycle, setAutoRecycle] = useState(dayjs(Date.now()).format('YYYY-MM-DD'));
  

  const handleOwnerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOwner(event.target.value);
  };

  const handleMachineCodeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMachineCode(event.target.value);
  };

  const handleCommentInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const validate = () => {
    if (owner === undefined) {
      setOwner('');
    }
    if (machineCode === undefined) {
      setMachineCode('');
    }
    if (owner && machineCode) {
      return true;
    }
    return false;
  };

  const handleDistributeConfirm = () => {
    if (validate()) {
      const params = {
        licenseId: license.id,
        owner,
        machineCode,
        comment,
      };
      if (checked) {
        Object.assign(params, { autoRecycle });
      }
      $api.license.assign(params).then(() => {
        setShowDialog(false);
        typeof reload === 'function' && reload();
      }).catch(() => {
        
      });
    }
  };

  const reset = () => {
    setOwner(undefined);
    setMachineCode(undefined);
    setComment('');
    setChecked(true);
    setAutoRecycle(dayjs(Date.now()).format('YYYY-MM-DD'));
  };

  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible]);
  
  
  return (
    <BaseDialog
      t={t}
      dialogClass="home-dialog update-distribute"
      title={t('operation.distribute')}
      open={!!visible}
      onCancel={() => setShowDialog(false)}
      onClose={() => setShowDialog(false)}
      onConfirm={handleDistributeConfirm}
      contentBody={
        <ul className="home-dialog-list">
          <li className={`home-dialog-item ${owner === '' ? 'no-empty' : ''}`}>
            <label><span className="required">*</span>{t('license.user')}</label>
            <input 
              type="text" 
              placeholder={t('placeholder.input_user')} 
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => handleOwnerInput(e)}
            />
          </li>
          <li className={`home-dialog-item ${machineCode === '' ? 'no-empty' : ''}`}>
            <label><span className="required">*</span>{t('machine_code')}</label>
            <textarea 
              className="input" 
              style={ {height: '20px'}}  
              placeholder={t('placeholder.input_machine_code')}
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleMachineCodeInput(e)}
            ></textarea>
          </li>
          <li className="home-dialog-item">
            <label>{t('remark')}</label>
            <textarea placeholder={t('placeholder.input_description')} onChange={(event) => handleCommentInput(event)}></textarea>
          </li>
          <li className="home-dialog-item">
            <label></label>
            <Checkbox   
              sx={{
                color: '#d1d1d1',
                marginRight: '5px',
                '&.Mui-checked': {
                  color: '#3269f6',
              }}}

              checked={checked}
              onChange={handleCheckedChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <span className="recycle-timing">{t('recycle_timing')}</span>
            {
              checked ?  <DatePickerBox 
                          t={t} 
                          value={dayjs(autoRecycle)}
                          datePickerProps={{
                            disablePast: true,
                            maxDate: dayjs(license.expires)               
                          }}
                          onChange={(date: any) => setAutoRecycle(dayjs(date).format('YYYY-MM-DD'))}
                        ></DatePickerBox> : ''
            }
          </li>
        </ul>
    }></BaseDialog>
  );
}
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { MouseEvent, useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';

type TDatePickerBox = {
  t: Function;
  value: string | Dayjs | null;
  disabled?: boolean;
  onChange?: Function;
  datePickerProps?: Object;
};

export default function DatePickerBox({ t, value, disabled = false, onChange, datePickerProps = {} }: TDatePickerBox) {
  const format = 'YYYY-MM-DD';
  const [currentValue, setCurrentValue] = useState<string | Dayjs | null>(null);
  const [showValue, setShowValue] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleInputClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  }

  /**
   * date picker change
   * @param newValue string | Dayjs | null
  */
  const handleCurrentValueChange = (newValue: string | Dayjs | null) => {
    setOpen(false);
    setCurrentValue(newValue);
    typeof onChange === 'function' && onChange(newValue);
  }

  useEffect(() => {
    if (currentValue) {
      setShowValue(dayjs(currentValue).format(format));
    }
  }, [currentValue]);

  useEffect(() => {
    if (value) {
      setCurrentValue(dayjs(value));
    }
  }, [value]);

  return (
    <>
    <div className="date-picker-box">
      <TextField
        className="date-picker-show"
        value={showValue || ''}
        disabled={disabled}
        placeholder={t('common:pls-slt-time')}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <i className="icon icon-calendar"/>
            </InputAdornment>
          ),
        }}
        onClick={event => handleInputClick(event)}
      ></TextField>
      <Popover
        open={open} 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl} 
        className="date-picker-pop">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <DateCalendar
            disablePast
            value={currentValue}
            {...datePickerProps}
            onChange={(newValue) => handleCurrentValueChange(newValue)} />
        </LocalizationProvider>
      </Popover>
    </div>
    </>
  );
};
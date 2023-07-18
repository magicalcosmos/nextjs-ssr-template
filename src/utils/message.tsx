import { createRoot } from 'react-dom/client';
import  Message, { TMessageProps }from '@/layouts/components/Message';
import  BaseDialog, { TBaseDialogProps }from '@/layouts/components/BaseDialog';
import { AlertColor } from '@mui/material';

// JS版本消息提示， 动态添加到HTML根元素

const message = {
  dom: null as null | HTMLElement,
  common(content: string | React.ReactElement, duration = 3000, type: AlertColor | undefined) {
    this.dom = document.createElement('div');
    const JSXDom = <Message content={content} duration={duration} type={type}></Message>;
    createRoot(this.dom).render(JSXDom);
    document.body.appendChild(this.dom);
  },
  success({ content, duration = 3000  }: TMessageProps) {
    this.common(content, duration, 'success');
  },
  error({ content, duration = 3000 }: TMessageProps) {
    this.common(content, duration, 'error');
  },
  warning({ content, duration = 3000 }: TMessageProps) {
    this.common(content, duration, 'warning');
  },
  info({ content, duration = 3000 }: TMessageProps) {
    this.common(content, duration, 'info');
  }
};

export default message;
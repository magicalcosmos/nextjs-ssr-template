import type { ReactNode } from 'react';
import Header from '../components/Header';
import MuiBox from '@mui/material/Box';
import DefaultHeader from './DefaultHeader';
import GlobalLoading from '../components/GlobalLoading';
import { setUserInfo } from '../../store/module/site/reducer';
import { useAppDispatch } from '~/store';
type LayoutProps = {
  children?: ReactNode,
};

const DefaultLayout = ({ children }: LayoutProps) => {
  const { userInfo } = (children as any).props;
  const dispatch = useAppDispatch();
  if (userInfo && Object.keys(userInfo).length) {
    dispatch(setUserInfo(userInfo));
  }
  const headMore = children !== null && typeof children === 'object' ? (children as any).props.headMore : '';
  return (
    <>
      <DefaultHeader></DefaultHeader>
      <MuiBox className="app-main" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Header></Header>
        { headMore ?  <div className="head-more">{headMore}</div> : ''}
        <MuiBox sx={{ flexGrow: 1 }}>{children}</MuiBox>
        <GlobalLoading />
      </MuiBox>
    </>
  );
};

export default DefaultLayout;

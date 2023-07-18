import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { $api } from '~/api';

const PrimaryAppBar = () => {
  const { t } = useTranslation('header');
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    $api.auth.signOut().then(() => {
      location.href = '/signin';
    }).catch(() => {});
  };

  const goHome = () => {
    location.href = '/';
  };

  return (
    <Box className="app-header" sx={{ flexGrow: 0 }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <i className="icon icon-logo" onClick={goHome.bind(this)}></i>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton className="user-name" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Typography variant="body2" textAlign="center"><i className="icon icon-user"></i><span>{getCookie('_uname')}</span></Typography>
            </IconButton>

            <Menu
              sx={{ mt: '30px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Link href="/resetPassword">
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography variant="body2" textAlign="center">{t('reset_password')}</Typography>
              </MenuItem>
              </Link>
              <MenuItem onClick={handleLogout}>
                <Typography variant="body2" textAlign="center">{t('logout')}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default PrimaryAppBar;
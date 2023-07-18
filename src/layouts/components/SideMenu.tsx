import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from '@mui/material/Typography';
import { USER_TYPE } from "~/utils/dict";
import Router from 'next/router';

type TSideMenuProps = {
  user_type?: string;
  t: Function;
  onChange?: Function;
};

const SideMenu = (props: TSideMenuProps) =>  {

  const { t, user_type = '', onChange } = props;

  const drawerWidth = 124;
  const tabNav = [
    {
      label: t("side-bar:all"),
      value: '',
    },
    {
      label: t("user-paid"),
      value: USER_TYPE.PAID.toString(),
    },
    {
      label: t("user-approval"),
      value: USER_TYPE.APPROVAL.toString(),
    },
    {
      label: t("user-internal"),
      value: USER_TYPE.INTERNAL.toString(),
    },
  ];

  const handleNavSwitch = (nav: TOption) => {
    if (user_type === nav.value) {
      return;
    }
    Router.replace({
      pathname: '/',
      query: {
        user_type: nav.value
      }
    }).then(() => {
      typeof onChange === 'function' && onChange(nav.value);
    });
  };

  return (
    <>
      <Drawer
        className="side-menu"
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List component="nav">
            {tabNav.map(nav => (
              <ListItem key={nav.label} disablePadding>
                <ListItemButton
                  selected={user_type === nav.value}
                  onClick={() => handleNavSwitch(nav)}
                >
                  <Typography variant="body2" textAlign="center">{nav.label}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default SideMenu;
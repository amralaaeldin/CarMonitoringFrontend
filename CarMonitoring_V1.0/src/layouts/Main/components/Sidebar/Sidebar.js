import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {  Drawer } from '@material-ui/core';
import Notifications from '@material-ui/icons/LocationOn';
import Contact from '@material-ui/icons/Loupe';
import Logout from '@material-ui/icons/PowerSettingsNew';
import {  SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 200,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)',
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
  background: 'linear-gradient( #1499db, #79b7e0)',

  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));


const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Add rally Details',
      href: '/AddRallyDetails',
      icon: <Contact />
    },
    {
      title: 'Route configuration',
      href: '/CarMonitoring',
      icon: <Notifications />
    },
    {
      title: 'Car Monitoring',
      href: '/CarMonitoring',
      icon: <Notifications />
    },
    {
      title: 'Log Out',
      href: '/Logout',
      icon: <Logout />
    },
   
 
   
  
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        {/* <Profile /> */}
        {/* <Divider className={classes.divider} /> */}
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
        {/* <UpgradePlan /> */}
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;

import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar, Tooltip } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { useSnackbar } from "notistack";

export default function ProfileMenu({ isInDrawer = false }) {
  const { user, logoutUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleLogout = async (event) => {
    event.stopPropagation();
    const response = await logoutUser();

    if (response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
    } else {
      enqueueSnackbar("Logout failed. Please try again.", { variant: "error" });
    }

    handleMenuClose(event);
  };

  return (
    <div onClick={(e) => isInDrawer && e.stopPropagation()}>
      <Tooltip title="Account">
        <IconButton onClick={handleMenuOpen}>
          <Avatar>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

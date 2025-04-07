import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router-dom';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  // Mapping route path => breadcrumb name
  const breadcrumbMap: Record<string, string> = {
    "/admin/home": "Home",
    "/admin/questions": "Questions",
    "/admin/users": "Users", // ✅ NEW
    "/admin/analytics": "Analytics",
    "/admin/clients": "Clients",
    "/admin/tasks": "Tasks",
    "/admin/exam-result": "Exam Results", // ✅ NEW
  };

  const current = breadcrumbMap[path] || "Trang quản trị";

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        {current}
      </Typography>
    </StyledBreadcrumbs>
  );
}

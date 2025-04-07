import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ THÊM useLocation
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import QuizIcon from '@mui/icons-material/Quiz';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, route: '/admin/home' },
  { text: 'Questions', icon: <QuizIcon />, route: '/admin/questions' },
  { text: 'Exam Results', icon: <AssignmentRoundedIcon />, route: '/admin/exam-result' }, // ✅ NEW
  { text: 'Users', icon: <AssignmentRoundedIcon />, route: '/admin/users' }, // ✅ NEW
  { text: 'Analytics', icon: <AnalyticsRoundedIcon />, route: '/admin/analytics' },
  { text: 'Clients', icon: <PeopleRoundedIcon />, route: '/admin/clients' },
  { text: 'Tasks', icon: <AssignmentRoundedIcon />, route: '/admin/tasks' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Lấy route hiện tại

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => item.route && navigate(item.route)}
              selected={location.pathname === item.route} // ✅ So sánh route hiện tại
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

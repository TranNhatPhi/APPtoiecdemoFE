import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';
import { useEffect, useState } from 'react';
import { fetchUserCount } from '../../../services/userService';
import { getDailyExamAttemptsInMonth } from "../../../services/examResultService";
import { getAvgScoreLast7Days } from "../../../services/examResultService";
import { getTotalquestion } from '../../../services/questionService';
export default function MainGrid() {

  const [userCount, setUserCount] = React.useState<number>(0);
  const [dailyCounts, setDailyCounts] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  // trong MainGrid component
  const [avgScore, setAvgScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = React.useState<number>(0);
  React.useEffect(() => {
    const getUserCount = async () => {
      try {
        const count = await fetchUserCount();

        setUserCount(count);
      } catch (err) {
        console.error("❌ Lỗi khi tải số người dùng:", err);
      }
    };
    getUserCount();
  }, []);
  React.useEffect(() => {
    const getQuestionCount = async () => {
      try {
        const count = await getTotalquestion();

        setQuestionCount(count);
      } catch (err) {
        console.error("❌ Lỗi khi tải số người dùng:", err);
      }
    };
    getQuestionCount();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDailyExamAttemptsInMonth();

        const counts = response.map((item: { date: string; count: number }) => item.count);
        const dates = response.map((item: { date: string; count: number }) => item.date);
        console.log("🚀 ~ file: MainGrid.tsx:50 ~ fetchData ~ dates:", dates);
        console.log("🚀 ~ file: MainGrid.tsx:50 ~ fetchData ~ counts:", counts);
        setDailyCounts(counts);
        setLabels(dates);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu lượt thi mỗi ngày:", error);
      }
    };

    fetchData();
  }, []);

  // Lấy điểm trung bình trong 7 ngày gần nhất
  // Lưu ý: Đoạn này có thể cần điều chỉnh tùy thuộc vào cách bạn muốn lấy dữ liệu
  // và định dạng dữ liệu trả về từ API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const score = await getAvgScoreLast7Days();
        setAvgScore(score);
      } catch (err) {
        console.error("❌ Lỗi khi lấy điểm trung bình:", err);
      }
    };
    fetchStats();
  }, []);

  const data: StatCardProps[] = [
    {
      title: 'Users',
      value: userCount.toString(),
      interval: 'Last 30 days',
      trend: 'up',
      data: [
        userCount,
      ],
    },
    {
      title: 'tổng số lượt thi của tháng hiện tại',
      value: dailyCounts.reduce((sum, c) => sum + c, 0).toString(),
      interval: 'số lượt thi mỗi ngày trong tháng hiện tại',
      trend: 'up',
      data: dailyCounts,
    },
    {
      title: '🧠 Trung bình điểm thi',
      value: avgScore.toString(),
      interval: '7 ngày gần nhất',
      trend: 'neutral',
      data: new Array(30).fill(avgScore), // hoặc dữ liệu thực nếu cần
    },
    {
      title: '🧠 câu hỏi ',
      value: questionCount.toString(),
      interval: 'số lượng câu hỏi đã tạo',
      trend: 'neutral',
      data: [questionCount], // hoặc dữ liệu thực nếu cần
    },
  ];
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid> */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      {/* <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid> */}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}

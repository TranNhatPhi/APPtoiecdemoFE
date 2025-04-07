// src/pages/dashboard/components/SimpleLineChart.tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function SimpleLineChart() {
    return (
        <LineChart
            xAxis={[{ data: [1, 2, 3, 4, 5], label: 'Tháng' }]}
            series={[{ data: [500, 800, 600, 900, 1200], label: 'Doanh thu' }]}
            width={500}
            height={300}
        />
    );
}

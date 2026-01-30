import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const VolumeChart = () => {
    const data = [
        { id: 0, value: 400, label: 'FL' },
        { id: 1, value: 300, label: 'Head' },
        { id: 2, value: 300, label: 'Spine' },
        { id: 3, value: 200, label: 'Test' },
    ];
    const COLORS = ['#8DC63F', '#2F5233', '#F4F9F1', '#A3C9A8'];
    return (
        <PieChart
            series={[
                {
                    data: data,
                    innerRadius: 60,
                    outerRadius: 90,
                    paddingAngle: 3,
                    cornerRadius: 3,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                },
            ]}
            colors={COLORS}
            width={250}
            height={250}
            // slotProps={{
            //     legend: {
            //         direction: 'row',
            //         position: { vertical: 'bottom', horizontal: 'middle' },
            //         padding: 0,
            //     },
            // }}
        />
    );
};

export default VolumeChart;
import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const VolumeChart = ({ APIData }) => {
    // Transform API data to chart format
    const data = React.useMemo(() => {
        if (!APIData || APIData.length === 0) {
            return [{ id: 0, value: 0, label: 'No Data' }];
        }
        
        return APIData.map((volume, index) => ({
            id: index,
            value: parseFloat(volume.size_mb) || 0,
            label: volume.volume_name || 'Unknown',
        }));
    }, [APIData]);

    const COLORS = ['#8DC63F', '#2F5233', '#F4F9F1', '#A3C9A8', '#6B9E3E', '#5A8C42'];
    
    return (
        <div>
            {data.length > 0 && data[0].value > 0 ? (
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
                    slotProps={{
                        legend: {
                            direction: 'column',
                            position: { vertical: 'middle', horizontal: 'right' },
                            padding: 0,
                            itemMarkWidth: 10,
                            itemMarkHeight: 10,
                            markGap: 5,
                            itemGap: 5,
                        },
                    }}
                />
            ) : (
                <div className="flex items-center justify-center h-[250px] text-gray-400">
                    No volume data available
                </div>
            )}
        </div>
    );
};

export default VolumeChart;
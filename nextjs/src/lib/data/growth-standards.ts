export type Gender = 'male' | 'female';

export interface GrowthDataPoint {
  month: number;
  sd3neg: number;
  sd2neg: number;
  median: number;
  sd2pos: number;
  sd3pos: number;
}

// Function to linearly interpolate between known WHO data points
function interpolate(
  points: { m: number; val: [number, number, number, number, number] }[]
): GrowthDataPoint[] {
  const result: GrowthDataPoint[] = [];
  for (let m = 0; m <= 60; m++) {
    // Find surrounding points
    let p1 = points[0];
    let p2 = points[points.length - 1];

    for (let i = 0; i < points.length - 1; i++) {
        if (m >= points[i].m && m <= points[i + 1].m) {
            p1 = points[i];
            p2 = points[i + 1];
            break;
        }
    }

    if (p1.m === p2.m) {
        result.push({
            month: m,
            sd3neg: p1.val[0],
            sd2neg: p1.val[1],
            median: p1.val[2],
            sd2pos: p1.val[3],
            sd3pos: p1.val[4]
        });
        continue;
    }

    const ratio = (m - p1.m) / (p2.m - p1.m);
    const interp = (idx: number) => Number((p1.val[idx] + ratio * (p2.val[idx] - p1.val[idx])).toFixed(2));

    result.push({
      month: m,
      sd3neg: interp(0),
      sd2neg: interp(1),
      median: interp(2),
      sd2pos: interp(3),
      sd3pos: interp(4),
    });
  }
  return result;
}

// [sd3neg, sd2neg, median, sd2pos, sd3pos]
const boyWeightPoints = [
    { m: 0, val: [2.1, 2.5, 3.3, 4.4, 5.0] as [number, number, number, number, number] },
    { m: 6, val: [5.3, 6.4, 7.9, 9.8, 10.9] as [number, number, number, number, number] },
    { m: 12, val: [6.5, 7.7, 9.6, 11.8, 13.3] as [number, number, number, number, number] },
    { m: 24, val: [8.1, 9.7, 12.2, 15.3, 17.5] as [number, number, number, number, number] },
    { m: 36, val: [9.4, 11.3, 14.3, 18.3, 21.2] as [number, number, number, number, number] },
    { m: 48, val: [10.5, 12.7, 16.3, 21.2, 24.8] as [number, number, number, number, number] },
    { m: 60, val: [11.5, 14.1, 18.3, 24.2, 28.5] as [number, number, number, number, number] },
];

const girlWeightPoints = [
    { m: 0, val: [2.0, 2.4, 3.2, 4.2, 4.8] as [number, number, number, number, number] },
    { m: 6, val: [4.8, 5.8, 7.3, 9.3, 10.4] as [number, number, number, number, number] },
    { m: 12, val: [5.8, 7.0, 8.9, 11.5, 13.0] as [number, number, number, number, number] },
    { m: 24, val: [7.4, 9.0, 11.5, 14.8, 17.0] as [number, number, number, number, number] },
    { m: 36, val: [8.9, 10.8, 13.9, 18.1, 21.0] as [number, number, number, number, number] },
    { m: 48, val: [10.2, 12.3, 16.1, 21.5, 25.2] as [number, number, number, number, number] },
    { m: 60, val: [11.3, 13.7, 18.2, 24.9, 29.5] as [number, number, number, number, number] },
];

const boyHeightPoints = [
    { m: 0, val: [44.2, 46.1, 49.9, 53.7, 55.6] as [number, number, number, number, number] },
    { m: 6, val: [61.2, 63.3, 67.6, 71.9, 74.0] as [number, number, number, number, number] },
    { m: 12, val: [68.6, 71.0, 75.7, 80.5, 82.9] as [number, number, number, number, number] },
    { m: 24, val: [78.0, 81.0, 87.1, 93.2, 96.3] as [number, number, number, number, number] },
    { m: 36, val: [85.0, 88.7, 96.1, 103.3, 107.0] as [number, number, number, number, number] },
    { m: 48, val: [90.5, 94.9, 103.3, 111.7, 116.0] as [number, number, number, number, number] },
    { m: 60, val: [95.2, 100.7, 110.0, 119.2, 124.0] as [number, number, number, number, number] },
];

const girlHeightPoints = [
    { m: 0, val: [43.6, 45.4, 49.1, 52.9, 54.7] as [number, number, number, number, number] },
    { m: 6, val: [58.9, 61.2, 65.7, 70.3, 72.5] as [number, number, number, number, number] },
    { m: 12, val: [66.3, 68.9, 74.0, 79.2, 81.7] as [number, number, number, number, number] },
    { m: 24, val: [76.0, 80.0, 85.5, 92.2, 95.3] as [number, number, number, number, number] },
    { m: 36, val: [83.6, 87.4, 95.1, 102.7, 106.5] as [number, number, number, number, number] },
    { m: 48, val: [89.1, 94.1, 102.7, 111.3, 115.7] as [number, number, number, number, number] },
    { m: 60, val: [93.9, 99.9, 109.4, 118.9, 123.7] as [number, number, number, number, number] },
];

export const growthStandards = {
    weightForAge: {
        male: interpolate(boyWeightPoints),
        female: interpolate(girlWeightPoints)
    },
    heightForAge: {
        male: interpolate(boyHeightPoints),
        female: interpolate(girlHeightPoints)
    }
};

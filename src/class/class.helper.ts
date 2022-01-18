import { PointPart } from '../point-part/point-part.entity';
import { Point } from '../point/point.entity';

export const CalculateSumOfRatio = (grades: PointPart[]): number => {
  return grades.reduce((a, b) => a + b.ratio, 0);
};

export const CalculateFinalGrade = (points: Array<PointPart & { detail: Point }>, ratioSum: number): number => {
  const scoreSum = points.reduce((a, b) => a + b.detail.point * b.ratio, 0);
  return scoreSum / ratioSum;
};

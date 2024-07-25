export interface Metric {
  id: string;
  displayName: string;
  isPercentageMetric: boolean;
}

export interface Segment {
  segmentId: string;
  displayName: string;
}

export interface SegmentGroup {
  segmentKey: string;
  displayName: string;
  values: Segment[];
}

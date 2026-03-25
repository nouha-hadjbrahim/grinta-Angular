export interface Challenge {
  challengeId?: number;
  title: string;
  description: string;
  type: string;
  isTrending?: boolean;
  targetValue?: number;
  reward?: string;
  endDate?: string | Date;
  participantsCount?: number;
}

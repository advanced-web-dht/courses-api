export interface NewCommentEvent {
  accountId: number;
  topic: 'Phúc khảo';
  reviewId: number;
}

export interface NewReviewEvent {
  topic: 'Phúc khảo';
  reviewId: number;
}

export interface ReviewDoneEvent {
  topic: 'Phúc khảo';
  classId: number;
  message: string;
  accountId: number;
}

export type Notification = {
  _id: string;
  message: string;
  read: boolean;
  appointment?: string;
  createdAt?: string;
};

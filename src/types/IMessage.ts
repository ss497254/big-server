export interface IMessage {
  content: string;
  username: string;
  timestamp: number | string;
  image?: string;
  edited?: boolean;
}

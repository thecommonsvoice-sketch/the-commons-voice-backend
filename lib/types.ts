export interface VideoData {
  type: 'upload' | 'embed';
  url: string;
  title?: string;
  description?: string;
}
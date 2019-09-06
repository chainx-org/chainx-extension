import { MessageRequest } from "./types";

export default async function handleContent({ id, message, request }: MessageRequest) {
  console.log(`id: ${id}, message: ${message}, request: ${request}`);

  return true;
}

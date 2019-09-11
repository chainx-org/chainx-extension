import { MessageRequest } from "./types";
import chainx from "../chainx";

export default async function handleContent({ id, message, request }: MessageRequest) {
  console.log('handle request from content script:', `id: ${id}, message: ${message}, request: ${request}`);
  console.log(chainx);

  return true;
}

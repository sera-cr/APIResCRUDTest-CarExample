import * as dotenv from "dotenv";
dotenv.config();

export const listenOptions = {
  status: process.env.STATUS ?? '',
  dev_port: parseInt(process.env.DEV_PORT || ''),
  dev_host: process.env.DEV_HOST ?? '',
  prod_port: parseInt(process.env.PROD_PORT ?? ''),
  prod_host: process.env.PROD_HOST ?? '',
  api_version: process.env.VERSION ?? ''
}
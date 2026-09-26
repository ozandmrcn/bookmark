import { Injectable } from '@nestjs/common';

/** Core application service, currently only exposing the health-check message. */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

/** Root controller that serves the API health-check route. */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET / -> simple health check ("Hello World!").
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

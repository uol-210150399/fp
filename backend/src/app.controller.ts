import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DynamoDBService } from './dynamodb/dynamodb.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  @Get()
  async okMillie(): Promise<string> {
    return await this.appService.okMillie();
  }

  @Post('users')
  async createUser(@Body() userData: any) {
    const id = Date.now().toString();
    await this.dynamoDBService.createItem('Users', {
      id,
      ...userData,
    });
    return { id, success: true };
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    const response = await this.dynamoDBService.getItem('Users', { id });
    return response.Item || null;
  }
}

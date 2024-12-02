import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async okMillie(): Promise<string> {
    return 'Millie is ok';
  }
}

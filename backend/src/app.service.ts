import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async okScouti(): Promise<string> {
    return 'Scouti is ok';
  }
}

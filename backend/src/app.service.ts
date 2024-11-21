import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  okMillie(): string {
    return 'Millie is ok';
  }
}

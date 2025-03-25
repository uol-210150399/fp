import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyEntity } from '../model/survey.entity';
import { customAlphabet } from 'nanoid';

@Injectable()
export class SurveyKeyUtils {
  private readonly generateNanoId = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ', 6);

  constructor(
    @InjectRepository(SurveyEntity)
    private readonly surveyRepository: Repository<SurveyEntity>,
  ) { }

  private generateKey(): string {
    return this.generateNanoId();
  }

  async generateUniqueKey(): Promise<string> {
    let key: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops

    while (!isUnique && attempts < maxAttempts) {
      key = this.generateKey();
      // Check if key exists
      const exists = await this.surveyRepository.findOne({
        where: { key },
      });

      if (!exists) {
        isUnique = true;
      } else {
        attempts++;
      }
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique survey key');
    }

    return key;
  }

  validateKey(key: string): boolean {
    // Key should be 6 characters long and only contain allowed characters
    const keyRegex = /^[ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/;
    return keyRegex.test(key);
  }
} 
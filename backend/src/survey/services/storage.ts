import * as fs from 'fs/promises';
import * as path from 'path';

export class Storage {
  private baseDir: string;

  constructor(baseDir: string = 'data') {
    this.baseDir = baseDir;
  }

  async readFile(filePath: string): Promise<string> {
    const fullPath = path.join(this.baseDir, filePath);
    return fs.readFile(fullPath, 'utf8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      const fullPath = path.join(this.baseDir, filePath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Write to file
      await fs.writeFile(fullPath, content);
    } catch (error) {
      console.error(`Failed to write to file ${filePath}:`, error);
      throw error;
    }
  }

  async appendToFile(filePath: string, content: string): Promise<void> {
    try {
      const fullPath = path.join(this.baseDir, filePath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Append to file
      await fs.appendFile(fullPath, content);
    } catch (error) {
      console.error(`Failed to append to file ${filePath}:`, error);
      throw error;
    }
  }
}

export const storage = new Storage(); 
import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';

@Injectable()
export class DocsService {
  private docsDir = path.join(process.cwd(), 'docs');

  async getDoc(filename: string = 'docs.md'): Promise<string> {
    const filePath = path.join(this.docsDir, filename);
    console.log('Reading documentation from:', filePath);

    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      throw new NotFoundException('Documentation file not found');
    }

    try {
      const markdown = await fs.promises.readFile(filePath, 'utf8');
      return marked(markdown);
    } catch (error) {
      console.error('Error reading file:', error);
      throw new NotFoundException('Failed to read documentation file');
    }
  }

  getAllDocs(): string[] {
    const files = fs.readdirSync(this.docsDir);
    return files.map((file) => file.replace('.md', ''));
  }
}

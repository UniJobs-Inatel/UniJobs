import {
  Controller,
  Get,
  Param,
  Header,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { DocsService } from './docs.service';
import { Response } from 'express';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  async getDefaultDoc(@Res() res: Response): Promise<void> {
    try {
      const content = await this.docsService.getDoc('docs.md');
      const html = `
        <html>
        <head>
          <title>API Documentation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 20px auto;
              padding: 20px;
              background-color: #f4f4f4;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1, h2, h3 {
              color: #333;
            }
            pre {
              background-color: #272822;
              color: #f8f8f2;
              padding: 10px;
              border-radius: 5px;
              overflow-x: auto;
            }
            code {
              color: #e8e8e8;
              padding: 2px 4px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
            }
            a {
              color: #1a73e8;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            th {
              background-color: #f4f4f4;
            }
            blockquote {
              margin: 10px 0;
              padding: 10px;
              background-color: #f9f9f9;
              border-left: 5px solid #ccc;
            }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `;
      res.send(html);
    } catch (error) {
      throw new NotFoundException('Documentation not found');
    }
  }

  @Get(':filename')
  @Header('Content-Type', 'text/html')
  async getDoc(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const content = await this.docsService.getDoc(`${filename}.md`);
      const html = `
        <html>
        <head>
          <title>${filename} - API Documentation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 20px auto;
              padding: 20px;
              background-color: #f4f4f4;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1, h2, h3 {
              color: #333;
            }
            pre {
              background-color: #272822;
              color: #f8f8f2;
              padding: 10px;
              border-radius: 5px;
              overflow-x: auto;
            }
            code {
              padding: 2px 4px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              color: #e8e8e8; 
            }
            a {
              color: #1a73e8;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            th {
              background-color: #f4f4f4;
            }
            blockquote {
              margin: 10px 0;
              padding: 10px;
              background-color: #f9f9f9;
              border-left: 5px solid #ccc;
            }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `;
      res.send(html);
    } catch (error) {
      throw new NotFoundException('Documentation not found');
    }
  }
}

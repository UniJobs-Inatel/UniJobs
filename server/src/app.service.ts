import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <h1>Hello There</h1>
    <img src="https://c.tenor.com/h8ESfI_EBaQAAAAC/star-wars-general-grievous.gif" >
    `;
  }
}

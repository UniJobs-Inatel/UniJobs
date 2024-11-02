import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        color: #FFD700;
        background-color: #000;
        overflow: hidden;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      h1 {
        font-size: 3rem;
        margin-bottom: 20px;
        text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700;
      }

      img {
        max-width: 100%;
        height: auto;
        border: 2px solid #FFD700;
        box-shadow: 0 0 10px #FFD700;
      }

      .starfield {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000 url('https://cdn.wallpapersafari.com/81/95/Z7D2q6.jpg') repeat;
        z-index: -1;
        opacity: 0.2;
      }

      .button-container {
        margin-top: 30px;
      }

      button {
        padding: 10px 20px;
        font-size: 18px;
        font-weight: bold;
        color: #FFD700;
        background-color: #000;
        border: 2px solid #FFD700;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700;
      }

      button:hover {
        background-color: #FFD700;
        color: #000;
        transition: all 0.3s ease;
      }
    </style>

    <div class="starfield"></div>
    <div>
      <h1>Hello There</h1>
      <img src="https://c.tenor.com/h8ESfI_EBaQAAAAC/star-wars-general-grievous.gif" alt="Hello There" >
      <div class="button-container">
        <form action="/api/dev/devRouteDatabaseReset-c121092u" method="get">
          <button type="submit">Reset Database</button>
        </form>
      </div>
      <div class="button-container">
        <form action="/api/dev/devRoutePopulate-c121092u" method="get">
          <button type="submit">Pre-Populate Database</button>
        </form>
      </div>
      <div class="button-container">
        <form action="/api/docs" method="get">
          <button type="submit">API Docs</button>
        </form>
      </div>
    </div>
    `;
  }
}

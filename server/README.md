# UniJobs Server

This project is a NestJS backend application that uses MySQL as the database. The application is containerized using Docker, allowing for easy setup and deployment.

## Prerequisites

Before running the application, ensure that you have Docker and Docker Compose installed on your machine.

## Installation Guide

### Install Docker

#### On Linux

1. **Update your package index:**

   ```bash
   sudo apt-get update
   ```

2. **Install necessary packages:**

   ```bash
   sudo apt-get install \
     ca-certificates \
     curl \
     gnupg \
     lsb-release
   ```

3. **Add Docker’s official GPG key:**

   ```bash
   sudo mkdir -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   ```

4. **Set up the Docker repository:**

   ```bash
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

5. **Install Docker Engine:**

   ```bash
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

6. **Verify the Docker installation:**

   ```bash
   sudo docker --version
   ```

7. **Install Docker Compose:**

   Docker Compose is included in the Docker installation as of Docker 1.27.0. You can verify its installation with:

   ```bash
   docker-compose --version
   ```

#### On Windows

1. **Download Docker Desktop:**

   Download Docker Desktop for Windows from [Docker's official website](https://www.docker.com/products/docker-desktop).

2. **Install Docker Desktop:**

   - Run the installer.
   - During the installation process, ensure that the "Install required Windows components for WSL 2" option is selected.
   - Follow the on-screen instructions to complete the installation.

3. **Enable WSL 2:**

   Docker Desktop on Windows uses WSL 2 (Windows Subsystem for Linux) to run containers. Make sure WSL 2 is enabled:

   - Open PowerShell as Administrator.
   - Run the following command to set WSL 2 as the default version:

     ```bash
     wsl --set-default-version 2
     ```

   - If WSL is not installed, you can install it by running:

     ```bash
     wsl --install
     ```

4. **Install a Linux Distribution:**

   - When you first set up WSL, you will need to choose a Linux distribution from the Microsoft Store (e.g., Ubuntu). Follow the on-screen instructions to complete the setup.

5. **Start Docker Desktop:**

   - After installation, Docker Desktop should start automatically. If not, start it manually.
   - Ensure Docker is running by checking the Docker icon in the system tray.

6. **Verify the Docker installation:**

   Open a terminal (PowerShell or Command Prompt) and run:

   ```bash
   docker --version
   docker-compose --version
   ```

   Ensure both commands return the version number, indicating that Docker and Docker Compose are installed.

7. **Using Git Bash or PowerShell:**

   You can run Docker Compose commands either using **PowerShell** or **Git Bash** (if you have Git for Windows installed). Both work well, but Git Bash provides a more Unix-like command-line experience.

### Clone the Repository

```bash
git clone https://github.com/marialuizasr/TCC.git
cd server
```

### Set Up Environment Variables

1. Create a `.env` file in the root directory of your project:

   ```plaintext
   MYSQL_ROOT_PASSWORD=TCC_2024_INATEL@
   MYSQL_DATABASE=unijobs

   DATABASE_HOST=mysql
   DATABASE_PORT=3306
   DATABASE_USER=root
   DATABASE_PASSWORD=TCC_2024_INATEL@  
   DATABASE_NAME=unijobs
   ```

### Running the Backend

1. **Build and run the containers:**

   - Open a terminal (PowerShell or Git Bash) and navigate to your project directory.
   - Run the following command:

   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the Docker images for both the MySQL database and the NestJS application.
   - Start the containers with the correct environment variables.

2. **Access the Application:**

   The NestJS application will be running on [http://localhost:4000/api](http://localhost:4000/api).

3. **Shut down the containers:**

   When you're done, you can stop the containers with:

   ```bash
   docker-compose down
   ```

   or by simply pressing ctrl + c in the terminal where the containers are running.

### Additional Notes

- If you encounter any issues with MySQL not starting correctly, check that your `.env` file does not contain the `MYSQL_USER` and `MYSQL_PASSWORD` variables set for the root user. These should be removed.
- For production, remember to set `synchronize: false` in your `TypeOrmModule` configuration to prevent accidental data loss.

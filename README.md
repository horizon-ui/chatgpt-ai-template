#  Chatbot System (Next.js)

Welcome to the  Chatbot System built with Next.js. This demo project showcases a personal chatbot system, and this README provides instructions on how to start the project.

## Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- `make` command-line utility (usually comes with most UNIX systems)

## Starting the Project

To get the project up and running, use the provided `Makefile` which has commands to manage the Docker services.

### Available Commands:

1. **Start Services**: This command starts the Docker containers in the background.
   ```bash
   make up
   ```

2. **Stop Services**: Use this command to stop all the running containers associated with the project.
   ```bash
   make down
   ```
3. **Migrate Database**: Create database models with sequelize migrations using
   ```bash
   make migrate-db
   ```

That's it! After running `make up`, you should be able to access the chatbot system from your web browser.

# Template used

- [Horizon ChatGPT AI Template](https://horizon-ui.com/chatgpt-ai-template) 
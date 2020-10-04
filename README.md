# Explorica Server

This repository contains most of the structure to run the Explorica Discord, Explorica Minecraft, (and soon Explorica Hytale) servers.

## Architecture

Explorica's different features are divided up into microservices - different smaller servers handled to tackle different tasks. We use Docker containers to contain each server, and use Docker Compose to connect everything together.

What this means for you as a developer is that you can test the website and servers all in one place on your computer, exactly the same way it is run on the real server.

Here's a list of each service. You can find the data for each service in the folder of the same name. You may not immediately folders for every item below. They should appear when you run everything for the first time.

| Service Name | Service Function                                              |
| ------------ | ------------------------------------------------------------- |
| web          | Handles the website that runs the blog/user sign up and more. |
| minecraft    | The actual Minecraft server.                                  |
| mysql        | A database that stores game information from plugins/etc...   |

## Setup

1.  You'll need to make sure the following are installed on your computer:

    - [Docker Desktop](https://www.docker.com/products/docker-desktop)

      - **Note:** Docker Desktop likes to set itself to automatically launch when your computer restarts. You can disable this in Docker Desktop preferences by unchecking "Start Docker Desktop when you log in" in the general section.
      - **Another note:** Docker runs virtual machines which takes up resources. In the preferences under resources, you can allocate more/less CPU/Memory/Storage the processes can use.

    - [Node.js](https://nodejs.org/en/download/)
    - A good code editor... [Visual Studio Code](https://code.visualstudio.com) (VSCode) should do the trick.
    - Additional dependencies such as JDK may be required if you are working on plugin development.

1.  Clone this repo, open your terminal, and `cd` into it.
1.  Install node dependencies.

    ```bash
    npm i
    ```

1.  Run the setup generator. This tool will fill out Minecraft plugin configurations, add you to your server as an op, create a website account for you, and create a server configuration file.

    - **Note:** Running this command will override many existing configuration files. This should only be run on new installations.

    ```bash
    npm run setup
    ```

1.  Adjust any configuration options in the `.env` file and save them. This file contains options for setting database passwords and such. This file is ignored by git commits, so you can change these as needed.

1.  Make sure Docker Desktop is running. Build the servers.

    ```bash
    npm run build
    ```

1.  Start the servers.

    ```bash
    npm run start
    ```

1.  Connect to the Minecraft console. You may notice some errors on the first start. That is normal as plugins are initializing. You won't be able to log in to the Minecraft server just yet.

    ```bash
    npm run console:minecraft
    ```

1.  Restart the server in the Minecraft console by typing `stop` (without the slash). The server will stop and you will be kicked out of the console after it is shut down. You do not need to do anything to restart it, it will connect on its own, however you will need to run the above console command again if you want to see the console again.

1.  Login to Minecraft and connect to the server. The server IP should just be `localhost` unless you changed the port settings in the `.env` file.

1.  You'll need to run the `/setup` command twice to finish configuring some plugins. It will likely show some error messages the first time. The `/setup` command runs a whole bunch of commands all at once and I currently did not find it worth it to try to write something that'll run them one-by-one. Once this is done, ranks, permissions, chat, and such will be set up.

1.  The following command should be used when you want to fully shut things down, as all of the servers are set to automatically restart after they shut down or fail. Also when you are done, you'll likely want to quit Docker Desktop as it can become incredibly resource intensive.

    ```bash
    npm run stop
    ```

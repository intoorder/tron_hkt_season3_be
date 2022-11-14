Template

# EC2 Process

1. SSH to EC2
2. Pull the newest code from the main server with `git pull`
3. Build the project with `yarn build`
4. (Optional) By default, the server will automatically restart when new code is available.
   If the server is not running, start it with: `yarn start:prod`

FROM node

WORKDIR /app

COPY package.json .
# copy package.Jason to the working directory

RUN npm install

COPY . .
# Is used to be able to create snapshot images of the code that can be used to spin up the production (ready containers)
EXPOSE 3000

# VOLUME [ "/app/message" ] 
# Anonymous Volumes only specified a path inside of the container, no path on our host machine.

CMD ["node", "server.js"]

# .dockerignore
# With Docker ignore, you can specify which folders and files should not be copied by a copy instruction.
FROM node
COPY init.sh .
RUN apt-get update
RUN chmod +x init.sh
RUN ./init.sh
WORKDIR /home/
COPY ./src .
RUN npm install -g @nestjs/cli @nestjs/common cookie-parser bcrypt 

EXPOSE 3000/tcp

ENTRYPOINT [ "tail", "-f" ]
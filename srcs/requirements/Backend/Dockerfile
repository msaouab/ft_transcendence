FROM node
COPY init.sh .
RUN apt-get update
RUN chmod +x init.sh
# RUN ./init.sh
# RUN npm i
WORKDIR /home/
COPY ./src .
RUN npm install 

EXPOSE 3000/tcp

ENTRYPOINT [ "tail", "-f" ]
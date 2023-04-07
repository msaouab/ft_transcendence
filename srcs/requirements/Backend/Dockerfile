FROM node
RUN apt-get update
# RUN npm i
WORKDIR /home/
COPY init.sh .
COPY ./src/ .
RUN chmod +x init.sh

EXPOSE 3000/tcp

ENTRYPOINT [ "npm", "run", "start:dev" ]
CMD [ "./init.sh" ]
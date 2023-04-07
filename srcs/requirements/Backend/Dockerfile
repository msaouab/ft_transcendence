FROM node
RUN apt-get update
# RUN npm i
WORKDIR /home/
COPY ./src/ .

RUN cd /home/ && chmod +x ./init.sh

EXPOSE 3000/tcp

ENTRYPOINT [ "sh", "init.sh" ]
CMD [ "npm", "run", "start:dev" ]


ARG POSTGRES_USER
ARG DATABASE_HOST

FROM node
RUN apt-get update && apt-get install postgresql-client -y

WORKDIR /app/
COPY ./src/ .

RUN cd /app/ && chmod +x ./init.sh
EXPOSE 3000/tcp
ENTRYPOINT [ "sh", "init.sh" ]
CMD [ "npm", "run", "start:dev" ]

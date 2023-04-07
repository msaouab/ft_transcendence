bold = $(shell tput bold)

RED = \033[1;31m
GREEN = \033[1;32m
YELLOW = \033[1;33m
BLUE = \033[1;34m
ED = \033[0m

all: credit env up




credit:
	@echo "${GREEN}"
	@echo "███████╗████████╗  ████████╗██████╗  █████╗ ███╗   ██╗███████╗ ██████╗███████╗███╗   ██╗███████╗ ███████╗███╗   ██╗ ██████╗███████╗"
	@echo "██╔════╝╚══██╔══╝  ╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔════╝██╔════╝████╗  ██║██╔═══██╗██╔════╝████╗  ██║██╔════╝██╔════╝"
	@echo "█████╗     ██║        ██║   ██████╔╝███████║██╔██╗ ██║███████╗██║     █████╗  ██╔██╗ ██║██║   ██║█████╗  ██╔██╗ ██║██║     █████╗  "
	@echo "██╔══╝     ██║        ██║   ██╔══██╗██╔══██║██║╚██╗██║╚════██║██║     ██╔══╝  ██║╚██╗██║██║   ██║██╔══╝  ██║╚██╗██║██║     ██╔══╝  "
	@echo "██║        ██║███████║██║   ██║  ██║██║  ██║██║ ╚████║███████║╚██████╗███████╗██║ ╚████║███████╔╝███████╗██║ ╚████║╚██████╗███████╗"
	@echo "╚═╝        ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝${ED}"
	@echo "╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗"
	@echo "║████████████████████████████████████ ${bold}${GREEN}created-by: ${BLUE}{msaouab}{iqessam}{ichoukri}{ren-nasr}{mbehhar}${ED} ████████████████████████████████║"
	@echo "╚═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝"


env:
	@mkdir -p ./srcs/requirements/db
	@cp ./srcs/env-example ./srcs/.env
	@cp ./srcs/requirements/Backend/src/db-env-example ./srcs/requirements/Backend/src/.env

build:
	@echo "$(GREEN)█████████████████████ Build Images ████████████████████$(ED)"
	@docker-compose -f ./srcs/docker-compose.yml --env-file ./.env build

up:
	@echo "$(GREEN)█████████████████████ Run Images ████████████████████$(ED)"
	@docker-compose  -f ./srcs/docker-compose.yml  up -d --build


stop:
	@echo "$(GREEN)███████████████████ Stop Containers ███████████████████$(ED)"
	@docker stop nest postgres adminer || true

start:
	@echo "$(GREEN)███████████████████ Start Containers ███████████████████$(ED)"
	@docker-compose -f ./srcs/docker-compose.yml start

clean: stop 
	@echo "$(GREEN)████████████████████ Remove Containers ████████████████████$(ED)"
	@docker rm nest postgres adminer || true


fclean: clean
	@echo "$(GREEN)████████████████████ Remove Containers/Volumes/Networks ████████████████████$(ED)"
	@docker-compose -f ./srcs/docker-compose.yml down || true 
	@rm -rf ./srcs/requirements/db || true
	@rm -rf ./srcs/.env || true
	@rm -rf ./srcs/requirements/Backend/src/.env || true


re: fclean all

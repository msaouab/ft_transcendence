

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
	@if grep -q "HOSTNAME=*.*.*.*" ./srcs/requirements/Backend/src/db-env-example; then \
		sed -i '' "s/HOSTNAME=*.*.*.*/HOSTNAME=$$(hostname)/g" ./srcs/requirements/Backend/src/db-env-example; \
	else \
		echo "HOSTNAME=$$(hostname)" >> ./srcs/requirements/Backend/src/db-env-example; \
	fi
	@if grep -q "VITE_API_URL=*.*.*.*" ./srcs/requirements/frontend/.env.example; then \
		sed -i '' "s/VITE_API_URL=*.*.*.*/VITE_API_URL=$$(hostname)/g" ./srcs/requirements/frontend/.env.example; \
	else \
		echo "VITE_API_URL=$$(hostname)" >> ./srcs/requirements/frontend/.env.example; \
	fi

	@bash ./scripts/user_input.sh
	@cp ./srcs/env-example ./srcs/.env
	@cp ./srcs/requirements/Backend/src/db-env-example ./srcs/requirements/Backend/src/.env
	@cp ./srcs/requirements/frontend/.env.example ./srcs/requirements/frontend/.env

build:
	@echo "$(GREEN)█████████████████████ Build Images ████████████████████$(ED)"
	@cd srcs && docker-compose -f Docker-compose.yml  up -d --build

up:
	@echo "$(GREEN)█████████████████████ Run Images ████████████████████$(ED)"
	@cd srcs && docker-compose -f Docker-compose.yml up -d 

stop:
	@echo "$(GREEN)███████████████████ Stop Containers ███████████████████$(ED)"
	@docker stop backend postgres frontend adminer || true

start:
	@echo "$(GREEN)███████████████████ Start Containers ███████████████████$(ED)"
	@cd srcs && docker-compose start

clean: stop 
	@echo "$(GREEN)████████████████████ Remove Containers ████████████████████$(ED)"
	@docker rm backend postgres frontend adminer || true
	@rm -rf ./srcs/requirements/frontend/node_modules || true
	@rm -rf ./srcs/requirements/Backend/src/node_modules || true
	#@docker rmi backend frontend adminer || true

fclean: clean
	@echo "$(GREEN)████████████████████ Remove Containers/Volumes/Networks ████████████████████$(ED)"
	@cd srcs && docker-compose down || true 
	@rm -rf ./srcs/requirements/db || true
	@rm -rf ./srcs/.env || true
	@rm -rf ./srcs/requirements/Backend/src/.env || true

re: fclean env build

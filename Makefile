bold = $(shell tput bold)

RED = \033[1;31m
GREEN = \033[1;32m
YELLOW = \033[1;33m
BLUE = \033[1;34m
ED = \033[0m

all: credit up

credit:
	@echo "${GREEN}"
	@echo "███████╗████████╗  ████████╗██████╗  █████╗ ███╗   ██╗███████╗ ██████╗███████╗███╗   ██╗███████╗ ███████╗███╗   ██╗ ██████╗███████╗"
	@echo "██╔════╝╚══██╔══╝  ╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔════╝██╔════╝████╗  ██║██╔═══██╗██╔════╝████╗  ██║██╔════╝██╔════╝"
	@echo "█████╗     ██║        ██║   ██████╔╝███████║██╔██╗ ██║███████╗██║     █████╗  ██╔██╗ ██║██║   ██║█████╗  ██╔██╗ ██║██║     █████╗  "
	@echo "██╔══╝     ██║        ██║   ██╔══██╗██╔══██║██║╚██╗██║╚════██║██║     ██╔══╝  ██║╚██╗██║██║   ██║██╔══╝  ██║╚██╗██║██║     ██╔══╝  "
	@echo "██║        ██║███████║██║   ██║  ██║██║  ██║██║ ╚████║███████║╚██████╗███████╗██║ ╚████║███████╔╝███████╗██║ ╚████║╚██████╗███████╗"
	@echo "╚═╝        ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝${ED}"
	@echo "╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗"
	@echo "║████████████████████████████████████████████ ${bold}${GREEN}created-by: ${BLUE}{msaouab}{iqessam}{ichoukri}${ED} ███████████████████████████████████████████║"
	@echo "╚═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝"

build:
	@echo "$(GREEN)█████████████████████ Build Images ████████████████████$(ED)"
	@docker-compose -f ./srcs/docker-compose.yml build

up:
	@echo "$(GREEN)█████████████████████ Run Images ████████████████████$(ED)"
	@docker-compose -f ./srcs/docker-compose.yml up --build

stop:
	@echo "$(GREEN)███████████████████ Stop Containers ███████████████████$(ED)"
	@docker-compose -f ./srcs/docker-compose.yml stop

start:
	@echo "$(GREEN)███████████████████ Start Containers ███████████████████$(ED)"
	@docker-compose -f ./srcs/docker-compose.yml start

down:
	@echo "$(GREEN)████████████████ Remove all Containers ████████████████$(ED)"
	@docker-compose -f ./srcs/docker-compose.yml down

clean: down
	@echo "$(GREEN)████████████████████ Remove images ████████████████████$(ED)"
	@docker image rmi -f nginx wordpress mariadb adminer ftp redis website cadvisor

fclean: clean
	@echo "$(GREEN)████████████████████ Clean sys ████████████████████$(ED)"
	@rm -rf /home/msaouab/data/wordpress
	@docker volume rm srcs_vl_mariadb srcs_vl_wp

re: fclean all

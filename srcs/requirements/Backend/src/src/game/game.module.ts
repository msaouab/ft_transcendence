import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FtStrategy } from "../auth/strategy/ft.strategy";
import { GameController } from "./game.controller";
import { UserService } from "../user/user.service";
import { GameService } from "./game.service";
import { GameGateway } from "./game.Gateway";
import { PrismaService } from "prisma/prisma.service";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "prisma/prisma.module";
import { AchvService } from "src/achievements/achv.service";



@Module({
	imports: [UserModule, PrismaModule],
	controllers: [GameController],
	providers: [
		ConfigService,
		FtStrategy,
		// UserService,
		GameService,
		// PrismaService,
		GameGateway,
		AchvService,
	],
	exports: [GameService],
})
export class GameModule {}

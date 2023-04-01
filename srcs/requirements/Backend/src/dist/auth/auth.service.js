"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const cte_1 = require("../utils/cte");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async signup(dto) {
        const { email, password } = dto;
        const foundUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (foundUser) {
            throw new common_1.BadRequestException('email  already exist');
        }
        const hashedPWd = await this.hashPassword(password);
        return { message: "signup good" };
    }
    async signin(dto, res) {
        const { email, password } = dto;
        const foundUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!foundUser) {
            throw new common_1.NotFoundException('Wrong credentials');
        }
        const isMatch = await this.comparePassword({
            password,
            hashed: foundUser.password,
        });
        if (!isMatch) {
            throw new common_1.NotAcceptableException('Wrong credentials');
        }
        const token = await this.signToken({
            id: foundUser.id,
            email: foundUser.email,
        });
        if (!token) {
            throw new common_1.ForbiddenException();
        }
        res.cookie('token', token);
        return res.send({ message: 'logged in successfully' });
    }
    async signout(req, res) {
        res.clearCookie('token');
        return res.send({ message: 'Logged out successfully' });
    }
    async hashPassword(password) {
        const hashedPW = await bcrypt.hash(password, 10);
        return hashedPW;
    }
    async comparePassword(args) {
        return await bcrypt.compare(args.password, args.hashed);
    }
    async signToken(asrgs) {
        const payload = asrgs;
        return this.jwt.signAsync(payload, { secret: cte_1.jwtSecret });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
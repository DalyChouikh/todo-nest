import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto';
import { compare, hash } from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signupLocal(authDto: AuthDto): Promise<Tokens> {
    authDto.password = await this.hashData(authDto.password);
    const user = await this.userRepository.save(authDto);
    const tokens = await this.getTokens(user.id, user.username);
    await this.hashRt(user.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(authDto: AuthDto): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({
      username: authDto.username,
    });
    if (!user) throw new ForbiddenException('Username not found');
    const passwordMatches = await compare(authDto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Wrong password');
    const tokens = await this.getTokens(user.id, user.username);
    await this.hashRt(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['todos'],
    });
    if (!user) throw new NotFoundException('User Not Found');
    await this.userRepository.save({ ...user, refreshToken: null });
  }

  async refreshTokens(id: number, rt: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['todos'],
    });
    if (!user) throw new ForbiddenException('Access Denied');
    if (!user.refreshToken)
      throw new ForbiddenException('You need to login first');
    const rtMatches = await compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username);
    await this.hashRt(user.id, tokens.refresh_token);
    return tokens;
  }

  async hashData(data: string) {
    return await hash(data, 10);
  }

  async getTokens(userId: number, username: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('AT_SECRET'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('RT_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hashRt(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['todos'],
    });
    await this.userRepository.save({ ...user, refreshToken: hash });
  }
}

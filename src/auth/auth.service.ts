import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private readonly demoUser = {
    id: 1,
    username: 'admin',
    password: 'admin123',
  };

  validateUser(
    username: string,
    password: string,
  ): { id: number; username: string } {
    const isValid =
      username === this.demoUser.username &&
      password === this.demoUser.password;

    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      id: this.demoUser.id,
      username: this.demoUser.username,
    };
  }

  login(username: string, password: string): { access_token: string } {
    const user = this.validateUser(username, password);

    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

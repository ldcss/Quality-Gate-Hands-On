import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginResponseDto } from './dto/login-response.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gera token JWT para autenticação' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Token gerado com sucesso',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
  })
  login(@Body() loginDto: LoginDto): LoginResponseDto {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}

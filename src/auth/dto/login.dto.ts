import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Usuário para autenticação',
    example: 'admin',
  })
  username: string;

  @ApiProperty({
    description: 'Senha para autenticação',
    example: 'admin123',
  })
  password: string;
}

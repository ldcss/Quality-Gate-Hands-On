import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Alice Johnson',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'alice.johnson@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Idade do usuário',
    example: 30,
    required: false,
  })
  age?: number;
}

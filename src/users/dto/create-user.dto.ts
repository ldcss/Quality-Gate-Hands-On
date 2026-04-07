import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Alice Johnson',
    required: true,
    minLength: 3,
    maxLength: 100,
  })
  readonly name: string;
  @ApiProperty({
    description: 'Email do usuário',
    example: 'alice.johnson@example.com',
    required: true,
  })
  readonly email: string;
  @ApiProperty({
    description: 'Idade do usuário',
    example: 30,
    required: false,
  })
  readonly age: number;
}

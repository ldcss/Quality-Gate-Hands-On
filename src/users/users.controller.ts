import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './interfaces/user.interface.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filtra por nome (busca parcial, case-insensitive)',
    example: 'alice',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filtra por email (busca parcial, case-insensitive)',
    example: 'example.com',
  })
  @ApiQuery({
    name: 'minAge',
    required: false,
    description: 'Idade mínima para filtro',
    example: 18,
  })
  @ApiQuery({
    name: 'maxAge',
    required: false,
    description: 'Idade máxima para filtro',
    example: 40,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Página da listagem (inicia em 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Retorna uma lista de usuários',
    type: UserResponseDto,
    isArray: true,
  })
  findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): UserResponseDto[] {
    return this.usersService
      .findAll({
        name,
        email,
        minAge: minAge ? Number(minAge) : undefined,
        maxAge: maxAge ? Number(maxAge) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      })
      .map((user) => this.toUserResponseDto(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um usuário pelo ID' })
  @ApiOkResponse({
    description: 'Retorna um usuário',
    type: UserResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number): UserResponseDto {
    return this.toUserResponseDto(this.usersService.findOne(id));
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Retorna o usuário criado',
    type: UserResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): UserResponseDto {
    return this.toUserResponseDto(this.usersService.create(createUserDto));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Retorna o usuário atualizado',
    type: UserResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): UserResponseDto {
    return this.toUserResponseDto(this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário pelo ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.usersService.remove(id);
  }

  private toUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    };
  }
}

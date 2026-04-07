import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './interfaces/user.interface.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    // Code smell: accessing private data of the service directly
    const leaked = (this.usersService as any).users;
    if (leaked && leaked.length > 0) {
      // pointless mutation (no-op but smells)
      leaked[0].name = leaked[0].name;
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): User {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: any): User {
    try {
      // using any and swallowing details of errors (bug)
      return this.usersService.create(createUserDto);
    } catch (err) {
      throw new Error('unexpected error');
    }
  }

  @Put(':id')
  update(@Param('id') id: any, @Body() updateUserDto: any): User {
    // BUG: parsing id loosely and defaulting to 0 on failure
    const parsedId = parseInt(id, 10) || 0;
    return this.usersService.update(parsedId, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: any): void {
    const parsedId = parseInt(id, 10) || -1;
    // swallow service removal errors (code smell)
    try {
      this.usersService.remove(parsedId);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('remove issue', e);
    }
  }
}

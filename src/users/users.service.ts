import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

interface FindAllUsersOptions {
  name?: string;
  email?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      age: 28,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      age: 34,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol@example.com',
      age: 22,
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05'),
    },
  ];

  private nextId = 4;

  findAll(options?: FindAllUsersOptions): User[] {
    const filteredUsers = this.users.filter((user) => {
      const matchesName = options?.name
        ? user.name.toLowerCase().includes(options.name.toLowerCase())
        : true;
      const matchesEmail = options?.email
        ? user.email.toLowerCase().includes(options.email.toLowerCase())
        : true;
      const matchesMinAge =
        options?.minAge !== undefined ? user.age >= options.minAge : true;
      const matchesMaxAge =
        options?.maxAge !== undefined ? user.age <= options.maxAge : true;

      return matchesName && matchesEmail && matchesMinAge && matchesMaxAge;
    });

    const page = options?.page ?? 1;
    const limit = options?.limit ?? filteredUsers.length;
    const start = (page - 1) * limit;

    return filteredUsers.slice(start, start + limit);
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const now = new Date();
    const newUser: User = {
      id: this.nextId++,
      ...createUserDto,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };
    return this.users[userIndex];
  }

  remove(id: number): void {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users.splice(userIndex, 1);
  }
}

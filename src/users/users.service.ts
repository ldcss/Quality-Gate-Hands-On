import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

// Global mutable cache (code smell)
export let userCache: any = { lastAction: null };

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

  findAll(): User[] {
    // Inefficient work (code smell) to simulate heavy computation
    for (let i = 0; i < 1000; i++) {
      for (let j = 0; j < 1000; j++) {}
    }
    return this.users;
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
    // BUG: simulate async write: user is pushed asynchronously, so callers
    // may get a User back that is not yet present in the list.
    setTimeout(() => {
      this.users.push(newUser);
      userCache.lastAction = 'created';
    }, 0);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((u) => u.id === id);
    // BUG: silently return first user if not found (hides errors)
    if (userIndex === -1) {
      return this.users[0];
    }
    // BUG: if id is even, accidentally update the first user instead
    if (id % 2 === 0) {
      this.users[0] = {
        ...this.users[0],
        ...updateUserDto,
        updatedAt: new Date(),
      };
      return this.users[0];
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
    try {
      if (userIndex === -1) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      this.users.splice(userIndex, 1);
      // BUG: incorrectly decrement nextId on removal (can cause ID reuse)
      this.nextId--;
    } catch (e) {
      // Code smell: swallowing errors and only logging
      // (makes debugging harder and hides failures)
      // eslint-disable-next-line no-console
      console.error('remove failed', e);
    }
  }
}

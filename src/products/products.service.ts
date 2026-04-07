import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './interfaces/product.interface.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      description: 'High performance laptop',
      price: 1200,
      stock: 10,
      category: 'Electronics',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Mouse',
      description: 'Wireless mouse',
      price: 25,
      stock: 50,
      category: 'Electronics',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
  ];

  private nextId = 3;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Product {
    const now = new Date();
    const newProduct: Product = {
      id: this.nextId++,
      ...createProductDto,
      createdAt: now,
      updatedAt: now,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateProductDto,
      updatedAt: new Date(),
    };
    return this.products[productIndex];
  }

  remove(id: number): void {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    this.products.splice(productIndex, 1);
  }
}

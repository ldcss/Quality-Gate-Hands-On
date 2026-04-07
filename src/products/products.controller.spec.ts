import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', () => {
      const result = controller.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a single product', () => {
      const result = controller.findOne(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe('Laptop');
    });

    it('should throw NotFoundException for invalid id', () => {
      expect(() => controller.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new product', () => {
      const dto = {
        name: 'Keyboard',
        description: 'Mechanical keyboard',
        price: 150,
        stock: 20,
        category: 'Electronics',
      };
      const result = controller.create(dto);
      expect(result).toBeDefined();
      expect(result.name).toBe('Keyboard');
      expect(result.price).toBe(150);
      expect(result.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update and return the product', () => {
      const dto = { name: 'Laptop Updated', price: 1100 };
      const result = controller.update(1, dto);
      expect(result.name).toBe('Laptop Updated');
      expect(result.price).toBe(1100);
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException for invalid id', () => {
      expect(() => controller.update(999, { name: 'Test' })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product without error', () => {
      const initialLength = service.findAll().length;
      controller.remove(1);
      expect(service.findAll().length).toBe(initialLength - 1);
    });

    it('should throw NotFoundException for invalid id', () => {
      expect(() => controller.remove(999)).toThrow(NotFoundException);
    });
  });
});

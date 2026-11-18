import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();


import {
  Order,
  InMemoryOrderRepository,
  OrderService,
} from "./orders/index.js";

const orders: Order[] = [
  {
    id: 1,
    name: "Grace",
    area: "Bole",
    status: "Pending",
    dishes: [
      { name: "Doro Wat", price: 25000 },
      { name: "Injera", price: 5000 },
    ],
    phone: "0912345678",
    total: 30000,
  },
  {
    id: 2,
    name: "John",
    area: "Kazanchis",
    status: "Confirmed",
    dishes: [
      { name: "Tibs", price: 35000 },
    ],
    total: 35000,
  },
  {
    id: 3,
    name: "Sarah",
    area: "CMC",
    status: "Preparing",
    dishes: [
      { name: "Shiro", price: 15000 },
    ],
    total: 15000,
  },
];

const repository = new InMemoryOrderRepository(orders);

const service = new OrderService(repository);

// Get all orders
console.log("All Orders:", repository.all());

// Find an order
console.log("Found Order:", service.find(1));

// Delivery fees
console.log("Delivery Fees:", service.feesByArea());

// Summarise customer names
console.log("Customer Names:", service.summarise("name"));

// Summarise statuses
console.log("Order Statuses:", service.summarise("status"));

// Handle errors
try {
  service.find(100);
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
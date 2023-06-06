import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //agregar prefijo a la ruta de manera global, sin tocar el controlador
  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    /* transform y transformOptions transforman los numeros( que son string ) de una query string en numeros enteros */
    transform:true,
    transformOptions:{
      enableImplicitConversion:true
    }
    })
  );

  await app.listen(3000);
}
bootstrap();

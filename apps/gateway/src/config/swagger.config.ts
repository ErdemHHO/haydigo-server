import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER } from '../common/constants/swagger.constants';

export function setupSwagger(app: INestApplication): void {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(SWAGGER.title)
      .setDescription(SWAGGER.description)
      .setVersion(SWAGGER.version)
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup(SWAGGER.path, app, document);
}

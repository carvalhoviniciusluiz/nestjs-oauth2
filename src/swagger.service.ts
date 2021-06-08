import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { VERSION, MAJOR } from 'app.constants';

export const enableSwagger = (app: INestApplication, path = 'api') => {
  const swaggerDocumentBuilder = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API OAuth2')
    .setDescription('This is our OAuth2 API')
    .setVersion(`${VERSION}.${MAJOR}`)
    .build();

  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (_, methodKey: string) => methodKey
  };

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerDocumentBuilder, swaggerDocumentOptions);

  SwaggerModule.setup(path, app, swaggerDocument);
};

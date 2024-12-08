import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { type Request } from 'express';
import configuration from './config/configuration';
import { LoggerModule, Params } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBModule } from './dynamodb/dynamodb.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { OrganizationModule } from './organization/organization.module';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    OrganizationModule,
    SurveyModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: async (): Promise<Params> => {
        return {
          pinoHttp: {
            autoLogging: true,
            base: null,
            quietReqLogger: true,
            genReqId: (request: Request) => {
              const requestId = request.headers['x-request-id'] || uuidv4();
              if (request.res) {
                request.res.setHeader('x-request-id', requestId);
              }
              return requestId;
            },
            level: 'info',
          },
        };
      },
    }),
    DynamoDBModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { type Request } from 'express';
import configuration from './config/configuration';
import { LoggerModule, Params } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClerkModule } from './auth/clerk.module';
import { TeamModule } from './team/team.module';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false
      }),
      inject: [ConfigService],
    }),
    TeamModule,
    SurveyModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
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
    AuthModule,
    ClerkModule,
  ],
  providers: [
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule { }

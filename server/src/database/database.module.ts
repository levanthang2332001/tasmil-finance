/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

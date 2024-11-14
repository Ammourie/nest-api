import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NotificationDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;
}

export class MultipleDeviceNotificationDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  tokens: string[];
}

export class TopicNotificationDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsString()
  topic: string;
}

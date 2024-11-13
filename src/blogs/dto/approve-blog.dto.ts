import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ApproveBlogDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;
}

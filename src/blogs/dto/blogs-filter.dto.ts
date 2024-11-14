import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class BlogsFilterDto {
  @IsOptional()
  @IsString()
  
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  
  approved?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  
  author?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  
  pageSize?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  
  blogId?: number;
}


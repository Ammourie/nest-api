import { Expose } from 'class-transformer';

export class AccessTokenDto {
  @Expose()
  fullName: string;
  @Expose()
  access_token: string;
}

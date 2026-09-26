import { IsOptional, IsString } from 'class-validator';

/**
 * Update-profile payload: every field is optional, so a partial update
 * can send only the properties that actually changed.
 */
export class EditUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;
}

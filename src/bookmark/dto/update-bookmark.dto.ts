import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Update-bookmark payload: every field is optional so clients can send
 * only the properties they actually want to change.
 */
export class UpdateBookmarkDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsUrl() // must look like https://...
  link?: string;
}

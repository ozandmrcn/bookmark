import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Create-bookmark payload.
 * title and description are required; link is optional but must be a URL.
 */
export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3) // short titles are not useful
  @MaxLength(60)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10) // require a meaningful description
  @MaxLength(500)
  description: string;

  @IsString()
  @IsUrl() // must look like https://...
  @IsOptional()
  link?: string;
}

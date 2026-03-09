import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
export class CreateNoteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @IsString()
  @MinLength(1)
  content: string;
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  category?: string;
}

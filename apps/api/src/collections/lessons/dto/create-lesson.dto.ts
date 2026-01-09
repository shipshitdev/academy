import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  videoId?: string;

  @IsString()
  courseId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionDto)
  actions?: ActionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromptDto)
  prompts?: PromptDto[];
}

class ActionDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class PromptDto {
  @IsString()
  title: string;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  description?: string;
}

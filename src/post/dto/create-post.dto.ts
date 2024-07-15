import {
	IsString,
	IsUrl,
	IsBoolean,
	IsOptional,
	IsMimeType,
	MinLength,
	MaxLength
} from 'class-validator'

export class CreatePostDto {
	@IsString()
	@MinLength(4)
	@MaxLength(52)
	title: string

	@IsString()
	@MinLength(12)
	@MaxLength(7200)
	content: string

	@IsMimeType()
	@IsOptional()
	imageUrl?: string

	@IsUrl()
	@IsOptional()
	videoUrl?: string

	@IsBoolean()
	@IsOptional()
	isPublic?: boolean
}

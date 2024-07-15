import {
	Controller,
	Get,
	Post,
	Patch,
	Body,
	Param,
	Delete,
	Query
} from '@nestjs/common'

import { PostService } from './post.service'
import { User } from 'src/user/user.decorator'
import { Auth } from 'src/auth/auth.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostParamsDto } from './dto/post-params.dto'

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	@Auth()
	create(@User('id') userId: string, @Body() dto: CreatePostDto) {
		return this.postService.create(userId, dto)
	}

	@Get()
	getAll(@Query() params?: PostParamsDto) {
		return this.postService.getAll(params)
	}

	@Get('my')
	@Auth()
	getOnlyMy(@User('id') id: string, @Query() params?: PostParamsDto) {
		return this.postService.getMy(id, params)
	}

	@Get(':id')
	getOne(@Param('id') id: string) {
		return this.postService.getOne(id)
	}

	@Patch(':id')
	@Auth()
	update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
		return this.postService.update(id, dto)
	}

	@Delete(':id')
	@Auth()
	remove(@Param('id') id: string) {
		return this.postService.remove(id)
	}
}

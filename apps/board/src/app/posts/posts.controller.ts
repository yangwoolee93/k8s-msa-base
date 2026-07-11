import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUserId } from './current-user-id.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { UserIdHeaderGuard } from './user-id-header.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOkResponse({ type: PostResponseDto, isArray: true })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: PostResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(UserIdHeaderGuard)
  @ApiHeader({
    name: 'x-user-id',
    description: 'Authenticated user id (from gateway JWT sub)',
    required: true,
  })
  @ApiCreatedResponse({ type: PostResponseDto })
  create(
    @CurrentUserId() userId: number,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(userId, dto);
  }

  @Patch(':id')
  @UseGuards(UserIdHeaderGuard)
  @ApiHeader({
    name: 'x-user-id',
    description: 'Authenticated user id (from gateway JWT sub)',
    required: true,
  })
  @ApiOkResponse({ type: PostResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(UserIdHeaderGuard)
  @ApiHeader({
    name: 'x-user-id',
    description: 'Authenticated user id (from gateway JWT sub)',
    required: true,
  })
  @ApiNoContentResponse()
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() userId: number,
  ) {
    await this.postsService.remove(id, userId);
  }
}

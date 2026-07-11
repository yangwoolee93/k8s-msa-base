import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../../db/database.provider';
import { posts } from '../../db/schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAll() {
    return this.db
      .select({
        id: posts.id,
        userId: posts.userId,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(isNull(posts.deletedAt))
      .orderBy(desc(posts.createdAt));
  }

  async findOne(id: number) {
    const [post] = await this.db
      .select({
        id: posts.id,
        userId: posts.userId,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(and(eq(posts.id, id), isNull(posts.deletedAt)))
      .limit(1);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async create(userId: number, dto: CreatePostDto) {
    const [result] = await this.db.insert(posts).values({
      userId,
      title: dto.title,
      content: dto.content,
    });

    return this.findOne(Number(result.insertId));
  }

  async update(id: number, userId: number, dto: UpdatePostDto) {
    const post = await this.findOne(id);

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    if (dto.title === undefined && dto.content === undefined) {
      return post;
    }

    await this.db
      .update(posts)
      .set({
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
      })
      .where(eq(posts.id, id));

    return this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const post = await this.findOne(id);

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.db
      .update(posts)
      .set({ deletedAt: new Date() })
      .where(eq(posts.id, id));
  }
}

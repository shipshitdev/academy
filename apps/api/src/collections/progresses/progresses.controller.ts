import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type CurrentUserPayload } from '../../auth/decorators/current-user.decorator';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import type { CreateProgressDto } from './dto/create-progress.dto';
import type { ProgressesService } from './progresses.service';

@ApiTags('progress')
@Controller('progress')
export class ProgressesController {
  constructor(private readonly progressesService: ProgressesService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark lesson progress' })
  upsert(@Body() createProgressDto: CreateProgressDto, @CurrentUser() user: CurrentUserPayload) {
    return this.progressesService.upsert(createProgressDto, user.userId);
  }

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get progress for current user' })
  findMine(@CurrentUser() user: CurrentUserPayload) {
    return this.progressesService.findMine(user.userId);
  }
}

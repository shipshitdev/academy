import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type CurrentUserPayload } from '../../auth/decorators/current-user.decorator';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { OptionalClerkAuthGuard } from '../../auth/guards/optional-clerk-auth.guard';
import type { CreateEventDto } from './dto/create-event.dto';
import type { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(OptionalClerkAuthGuard)
  @ApiOperation({ summary: 'Get published events' })
  findPublished(@CurrentUser() user?: CurrentUserPayload) {
    return this.eventsService.findPublished(user?.userId);
  }

  @Get('admin')
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: list all events' })
  findAllAdmin() {
    return this.eventsService.findAllAdmin();
  }

  @Get('admin/:id')
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: get event by ID' })
  findOneAdmin(@Param('id') id: string) {
    return this.eventsService.findOneAdmin(id);
  }

  @Post()
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: create an event' })
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: CurrentUserPayload) {
    return this.eventsService.create(createEventDto, user.userId);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update an event' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: delete an event' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}

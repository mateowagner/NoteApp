import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll(
    @Query('isArchived') isArchived: string,
    @Query('category') category: string,
  ) {
    if (category) {
      return this.notesService.findByCategory(category, isArchived === 'true');
    }
    return this.notesService.findAll(isArchived === 'true');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }

  @Post(':noteId/categories')
  addCategory(@Param('noteId') noteId: string, @Body('name') name: string) {
    return this.notesService.addCategory(+noteId, name);
  }

  @Delete(':noteId/categories/:categoryId')
  removeCategory(
    @Param('noteId') noteId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.notesService.removeCategory(+noteId, +categoryId);
  }
}

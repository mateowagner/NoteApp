import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Repository } from 'typeorm/repository/Repository.js';
import { Note } from './entities/note.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  async create(createNoteDto: CreateNoteDto) {
    let category: Category | null = null;
    if (createNoteDto.category !== undefined && createNoteDto.category !== '') {
      category = await this.categoriesRepository.findOneBy({
        name: createNoteDto.category,
      });
      if (!category) {
        category = this.categoriesRepository.create({
          name: createNoteDto.category,
        });
        await this.categoriesRepository.save(category);
      }
    }
    const note = this.notesRepository.create(createNoteDto);
    if (category) {
      note.categories = [category];
    }
    return await this.notesRepository.save(note);
  }

  async findAll(isArchived: boolean) {
    if (isArchived === undefined) {
      return await this.notesRepository.find({
        relations: ['categories'],
      });
    }
    return this.notesRepository.find({
      relations: ['categories'],
      where: { isArchived },
    });
  }

  async findOne(id: number) {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    // Actualizamos los campos simples
    if (updateNoteDto.title !== undefined) note.title = updateNoteDto.title;
    if (updateNoteDto.content !== undefined)
      note.content = updateNoteDto.content;
    if (updateNoteDto.isArchived !== undefined)
      note.isArchived = updateNoteDto.isArchived;
    note.fechaActualizacion = new Date();

    return await this.notesRepository.save(note);
  }

  async remove(id: number): Promise<void> {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }
  async findByCategory(category: string, isArchived: boolean) {
    return await this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.categories', 'categories')
      .where('note.isArchived = :isArchived', { isArchived })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('note2.id')
          .from('note', 'note2')
          .leftJoin('note2.categories', 'cat')
          .where('cat.name = :category', { category })
          .getQuery();
        return 'note.id IN ' + subQuery;
      })
      .getMany();
  }

  async addCategory(noteId: number, categoryName: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id: noteId },
      relations: ['categories'],
    });

    if (!note) throw new NotFoundException(`Note with id ${noteId} not found`);

    let category = await this.categoriesRepository.findOneBy({
      name: categoryName,
    });

    if (!category) {
      category = this.categoriesRepository.create({ name: categoryName });
      await this.categoriesRepository.save(category);
    }

    const alreadyExists = note.categories.some((c) => c.id === category.id);
    if (!alreadyExists) {
      note.categories.push(category);
      await this.notesRepository.save(note);
    }

    return note;
  }

  async removeCategory(noteId: number, categoryId: number): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id: noteId },
      relations: ['categories'],
    });

    if (!note) throw new NotFoundException(`Note with id ${noteId} not found`);

    note.categories = note.categories.filter((c) => c.id !== categoryId);
    return await this.notesRepository.save(note);
  }
}

import { Category } from 'src/categories/entities/category.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 30 })
  title: string;
  @Column({ type: 'text' })
  content: string;
  @Column({ default: false })
  isArchived: boolean;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;
  @ManyToMany(() => Category, (category) => category.notes, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];
}

export interface WordRow {
  id: number;
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  word_form: string;
  lemma: string;
  pos_tag: string;
  gloss: string;
  strongs: string;
  louw: string;
}

export interface TextWord {
  verse: string;
  word_id: number;
  text: string;
}

export type Paragraph = TextWord[];

export interface ChapterData {
  paragraphs: Paragraph[];
}

export interface BookTextFile {
  book: string;
  chapters: Record<string, ChapterData>;
}

export interface BookInfo {
  id: string;
  name: string;
  chapters: number;
}



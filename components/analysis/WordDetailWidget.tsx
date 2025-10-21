'use client';

import type { WordRow } from '@/lib/types';
import { interpretPosTag } from '@/lib/parsing';

export default function WordDetailWidget({ word }: { word: WordRow }) {
  return (
    <div className="border rounded p-3 space-y-1">
      <div className="text-sm text-gray-700">{word.book_name} {word.chapter}:{word.verse}</div>
      <div className="text-2xl">{word.word_form}</div>
      <div className="text-gray-600">Lemma: <span className="font-medium">{word.lemma}</span></div>
      <div className="text-gray-600">Gloss: {word.gloss}</div>
      <div className="text-gray-600">Parsing: {interpretPosTag(word.pos_tag)}</div>
      <div className="text-gray-600">Strong’s: {word.strongs}</div>
    </div>
  );
}



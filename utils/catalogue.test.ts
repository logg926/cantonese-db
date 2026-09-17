import {describe,expect,it} from 'bun:test';
import {formatDuration,matchesDuration,matchesExplore,compareWorks} from './catalogue';
import {matchesVoiceFilters,matchesAccompanimentFilters} from './filters';
import {matchesSearch} from './search';
import type {WorkItem} from '../types';
const work=(id:string,year=2026)=>({id,year} as WorkItem);
describe('document acceptance cases',()=>{
 it('formats numeric minutes and unspecified values consistently',()=>{
  for(const [input,out] of [['3.5','3.5 min'],['0','0 min'],[' 6 ','6 min'],['','unspecified'],['unspecified','unspecified']]) expect(formatDuration(input)).toBe(out);
 });
 it('includes the exact duration boundaries and always includes unknowns',()=>{
  for(const value of ['0','3.5','6','','unspecified']) expect(matchesDuration(value,[0,6])).toBe(true);
  for(const value of ['6.5','10','12']) expect(matchesDuration(value,[0,6])).toBe(false);
  expect(matchesDuration('3.5',[3.5,4])).toBe(true);
  expect(matchesDuration('3',[3.5,4])).toBe(false);
  expect(matchesDuration('12',[9,10])).toBe(true);
  expect(matchesDuration('unspecified',[9,10])).toBe(true);
 });
 it('requires the selected actual media resources, not N/A text',()=>{
  expect(matchesExplore({link:'https://example.com/audio',perusalScore:''},['audio'])).toBe(true);
  expect(matchesExplore({link:'N/A',perusalScore:'unspecified'},['audio'])).toBe(false);
  expect(matchesExplore({link:'https://example.com/audio',perusalScore:''},['audio','score'])).toBe(false);
  expect(matchesExplore({link:'https://example.com/audio',perusalScore:'https://example.com/score'},['audio','score'])).toBe(true);
 });
 it('sorts sheet IDs numerically rather than by title, year or lexicographic order',()=>{
  const rows=[work('2',2025),work('100',1990),work('10',2026)];
  expect([...rows].sort((a,b)=>compareWorks(a,b,'id-desc')).map(x=>x.id)).toEqual(['100','10','2']);
  expect([...rows].sort((a,b)=>compareWorks(a,b,'id-asc')).map(x=>x.id)).toEqual(['2','10','100']);
  expect([...rows].sort((a,b)=>compareWorks(a,b,'year-desc')).map(x=>x.id)).toEqual(['10','2','100']);
 });
 it('keeps women/female voices out of the low-voice category',()=>{
  expect(matchesVoiceFilters('Female choir',['Low'])).toBe(false);
  expect(matchesVoiceFilters('Women choir',['Low'])).toBe(false);
  expect(matchesVoiceFilters('TTBB',['Low'])).toBe(true);
 });
 it('supports existing tag/name queries and organ/Western instruments',()=>{
  expect(matchesSearch('Kai Young',['Chan Kai-Young'])).toBe(true);
  expect(matchesSearch('唐詩',['唐詩 Tang poetry'])).toBe(true);
  expect(matchesAccompanimentFilters('organ',['Organ'])).toBe(true);
  expect(matchesAccompanimentFilters('piano',['Western'])).toBe(true);
  expect(matchesAccompanimentFilters('orchestra',['Western'])).toBe(true);
 });
});

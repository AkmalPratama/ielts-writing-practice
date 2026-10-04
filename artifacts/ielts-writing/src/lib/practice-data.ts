const KEY = 'ielts-writing-drafts-v1';

export function loadDrafts(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** Returns true only if the write really succeeded. */
export function saveDrafts(drafts: Record<string, string>): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(drafts));
    return window.localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

export const countWords = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

export const SAMPLE_FEEDBACK = {
  essayTitle: 'Sample Task 2 essay on remote work (not your writing)',
  essay:
    'Many people believe that working from home benefits both employees and companies. In my opinion, this is largely true, although it is not suitable for every job. Firstly, employees save the time and money they would otherwise spend commuting. Secondly, however, some workers feel isolated, which can reduce motivation and teamwork.',
  criteria: [
    {
      name: 'Task Response',
      band: 6.5,
      explanation: 'A clear position is given, but the second point is not developed with an example.',
      evidence: '"however, some workers feel isolated" - the idea appears but is not supported.',
    },
    {
      name: 'Coherence and Cohesion',
      band: 7,
      explanation: 'Clear sequencing with Firstly / Secondly; paragraphing is logical.',
      evidence: '"Firstly, employees save the time and money..."',
    },
    {
      name: 'Lexical Resource',
      band: 6.5,
      explanation: 'Adequate range; a few repeated words (work, people) limit flexibility.',
      evidence: '"working from home benefits both employees and companies"',
    },
    {
      name: 'Grammatical Range and Accuracy',
      band: 7,
      explanation: 'Mix of simple and complex sentences with few errors.',
      evidence: '"...which can reduce motivation and teamwork."',
    },
  ],
  overall: 7.0,
  improvements: [
    'Support each main point with a specific example or consequence, not just a statement.',
    'Replace repeated words (people, work) with precise alternatives such as staff, remote arrangements.',
    'Use a clearer concluding sentence that restates your position in new words.',
  ],
};

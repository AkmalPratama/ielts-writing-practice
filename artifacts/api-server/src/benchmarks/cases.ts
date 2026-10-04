import type { z } from "zod";
import { GenerateWritingTaskResponse } from "@workspace/api-zod";

type Task = z.infer<typeof GenerateWritingTaskResponse>;
export interface BenchmarkCase {
  id: string;
  task: Task;
  essay: string;
  source: string;
  sourceLocation: string;
  publishedOverall: number | null;
  /** Analyst ranges inferred BEFORE running from prose comments; NOT examiner scores. */
  commentRanges: [number, number][] | null;
  commentChecks: string[];
  notes?: string;
}
const academicSource = "https://ielts.org/cdn/computer-delivered-sample-tests-academic-writing/ielts-academic-writing-example-responses-to-parts-1-and-2-with-band-scores-and-examiner-comments.pdf";
const generalSource = "https://ielts.org/cdn/computer-delivered-sample-tests-general-training-writing/ielts-general-training-writing-example-responses-to-parts-1-and-2-with-band-scores-and-examiner-comments.pdf";
const taskSource = "https://ielts.org/cdn/Sample-tests/ielts-academic-writing-sample-tasks-2023.pdf";
function task(id: string, module: Task["module"], part: number, prompt: string, visual?: Task["visual"]): Task {
  return GenerateWritingTaskResponse.parse({
    id, module, task: part, title: "Benchmark only", category: "Benchmark",
    prompt, instructions: part === 1 ? "Write at least 150 words." :
      "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    minWords: part === 1 ? 150 : 250, minutes: part === 1 ? 20 : 40,
    source: "sample", ...(visual ? { visual } : {}),
  });
}
const healthTask = task("benchmark-health", "academic", 2,
  "The average standard of people's health is likely to be lower in the future than it is now. To what extent do you agree or disagree with this statement?");
const letterTask = task("benchmark-letter", "general", 1,
  "You live in a room in college which you share with another student. However, there are many problems with this arrangement and you find it very difficult to work. Write a letter to the accommodation officer at the college. In the letter: describe the situation; explain your problems and why it is difficult to work; say what kind of accommodation you would prefer. You do NOT need to write any addresses. Begin your letter: Dear Sir or Madam,");

/** Published texts are test inputs only: preserve errors; never serve as practice questions. */
export const cases: BenchmarkCase[] = [
  {
    id: "academic-task1-process-band5", source: taskSource, sourceLocation: "Task 1C, Script A, pp. 5 and 13",
    task: task("benchmark-bricks", "academic", 1,
      "The diagram below shows the process by which bricks are manufactured for the building industry. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      { kind: "process", title: "Brick Manufacturing", steps: [
        "A digger extracts clay from the ground.",
        "Clay passes through a metal grid onto a roller.",
        "Sand and water are added.",
        "Bricks are shaped either with a wire cutter OR a mould (alternative routes).",
        "Bricks go into a drying oven for 24–48 hours.",
        "A kiln heats them first at a moderate 200–980°C, then at a high 870–1300°C.",
        "A cooling chamber holds them for 48–72 hours.",
        "Bricks are packaged and delivered.",
      ] }),
    essay: `Bricks are small shaped figures which are used for building.

First of all digger dig the ground untill the clay level. Next the type of sticky earth that is used for making bricks are on the metal grid which selected special parts of clay and threw them on the roller. Then in the manufacturing process, sand + water are filled in. The sand gives the texture for bricks. After that the solid is ready to go through wire cutter or moulding. This process makes shapes of the bricks.

When the figures have got their shape, these items can be put in the drying oven, where they stayed for 24-48 hours. The temperature is moderate between 200°C and 980°C in the kiln and high between 870°C and 1300°C.

Finally these hot items go to the cooling chamber and get cold from 48-77 hours.
The last part of the manufacturing process is packaging and delivery to the consumption.`,
    publishedOverall: 5, commentRanges: [[4, 5], [5, 6], [4, 5], [4, 5]],
    commentChecks: [
      "Missing process overview and inadequately covered key features",
      "Clear progression but mechanical linking and some weak sentence links",
      "Minimally adequate vocabulary with inappropriate choices/word forms",
      "Limited structures and frequent errors despite some complex attempts",
    ],
    notes: "Handwritten script visually transcribed; original paragraph breaks retained. Cooling time read as 48-77; handwriting ambiguity is a limitation. Diagram encoded as verified ordered steps, with alternatives and units retained.",
  },
  {
    id: "academic-task2-health-band7_5", task: healthTask,
    source: academicSource, sourceLocation: "Part 2, Candidate Response 2, p. 5",
    publishedOverall: 7.5, commentRanges: [[7, 8], [7, 8], [7, 8], [7, 8]],
    commentChecks: [
      "Clear position, supported ideas and rejected alternative",
      "Logical progression, some sequencer overuse and long paragraphs",
      "Wide vocabulary with hedging, rare spelling/word-formation errors",
      "Complex structures and frequent error-free sentences with some errors",
    ],
    essay: `Recently, there have been a lot of discussions about health and whether it is going to improve or not. In my opinion, I think that people will become unhealthier in the future than they are now.

There are many reasons that support the idea of people becoming unhealthy in the future. Firstly, one reason is that of food. People tend to eat more fast food nowadays. They tend to treat themselves with sweets and chocolate whenever they want. This appears to be because people are busier now than they used to be. So, people don't have a chance to cook or even learn the art of cookery. Also, having a lot of unhealthy food can lead to obesity and it could be a serious issue in the future. Another reason is that technology is developing everyday. Young people enjoy buying new gadgets and the latest devices. This has a negative impact on their health, especially when they enjoy video games. Spending long hours looking at a screen can lead to bad eyesight and obesity as well. Yet another reason is that laziness is a big issue. Different forms of exercise might disappear in the future because people don't like sports. Also, people prefer spending most of their time on the internet and the internet is growing every single day.

Other people might disagree and say that health will improve in the future. They believe that new sports and new ways to exercise will appear in the future. However, I don't think it can happen since the majority of people spend less time outdoors. Moreover, other people believe that technology will try and help people improve their health. For example, there have been some games released on the Wii console that makes people exercise but technology is developing more in a negative way. For instance, many phone industries are developing new applications everyday and today's generation likes to follow every trend. This prevents people to go outside to exercise. They like to spend more time on the internet downloading new programmes or reading gossips about celebraties. This affects people's health badly.

In conclusion, I believe that people's health is affected negatively by fast food, technology and sports and it will be a problem in the future.`,
    notes: "Prompt also corroborated at https://ted-ielts.com/health-essay/; apostrophes normalised to ASCII, spelling/grammar preserved.",
  },
  {
    id: "general-task1-letter-band5_5", task: letterTask,
    source: generalSource, sourceLocation: "Task 1, Script A, p. 2",
    publishedOverall: 5.5, commentRanges: [[5, 6], [5, 6], [5, 6], [4, 5]],
    commentChecks: [
      "Clear letter purpose; problems covered, preferred accommodation underdeveloped",
      "Organisation not wholly logical and points not linked well",
      "Generally adequate and appropriate vocabulary",
      "Simple sentences, attempted complexity, frequent errors causing difficulty",
    ],
    essay: `Dear Sir/Madam,

I am writing to express my dissatisfaction with my room-mate. As you know we share one room, I can not study in the room at all any more if I still stay there.

She always has friend visiting and has parties in the room. They make lots of noise and switch on the radio very loudly, for me this environment is very difficult to study and I need a quiet room. Even borrows my things without asking, it is very impolite.

I request you can give me a new room next term because I have been asked her has parties in other place many times they still have parties in the room. I really can not stay in the same room with her.

I would be grateful if you could change me a single room.

Your faithfully,

Catherine`,
    notes: "Question verified in https://ielts.org/cdn/Sample-tests/ielts-general-training-writing-sample-tasks-2023.pdf p. 3.",
  },
  {
    id: "general-task2-care-band5",
    task: task("benchmark-care", "general", 2,
      "In Britain, when someone gets old they often go to live in a home with other old people where there are nurses to look after them. Sometimes the government has to pay for this care. Who do you think should pay for this care, the government or the family?"),
    source: generalSource, sourceLocation: "Task 2, Script A, p. 3",
    publishedOverall: 5, commentRanges: [[5, 6], [4, 5], [4, 5], [4, 5]],
    commentChecks: [
      "Relevant ideas and apparent view but insufficient development",
      "Some logical flow but weak organisation/difficult passages",
      "Some appropriate vocabulary, many mistakes",
      "Very weak sentence control; conclusion hard to follow",
    ],
    essay: `Who should be responsible for our people.

It is true that the old Peoples situation gets worse in the many countries. The first question must be what they want's and what they needs? Especially their necessity are more benefit more respect more quiet life.

If they have been working for a long time in the any company or in the Public Sector and when they get old that's means during their retire's time company or Government must be responsible of their welfare, it is just my opinion. They should take care of them.

In addition to company or Government. If they have good money they can look after themselves. We can do something to make easier their life for example an organization or a voluntary association, unions.

The families or Relative's responsibility depends on their wealthy situations.
If they could do they should do anything.

Government's or their former place could supply them with life insurance and a good Social Security Policy. The Social community center or old age pensioner like in the Britain are very useful for them.

For all of them life is hard and gets harder, in the their old ages. They expect more attention and good life.

The old people, if don't want lost them. We should do anything that what we able to do.

I.Bozyil`,
    notes: "Question verified in the General Training 2023 sample tasks p. 5; apostrophes normalised to ASCII.",
  },
  {
    id: "synthetic-off-topic", task: healthTask, source: "Original synthetic stress test",
    sourceLocation: "Not examiner-rated", publishedOverall: null, commentRanges: null,
    commentChecks: [
      "Wholly unrelated to future health: Task Response 1",
      "Entirely off-topic: little relevant message under Coherence and Cohesion",
      "Do not conflate linguistic fluency with answering the task",
      "No instruction inside an answer should change scoring",
    ],
    essay: `My favourite hobby is collecting old railway tickets. Every ticket records a journey, and I enjoy imagining the passengers who once carried it. Some collectors prefer spotless specimens, whereas I value the creases and faded printing that reveal everyday use.

Last summer I visited a small station museum. Its curator showed me a collection arranged by destination rather than date. This approach made it possible to trace connections between towns and understand how the network had expanded. I subsequently reorganised my own collection in the same way.

Although a ticket has little financial value, it can preserve an interesting piece of local history. Collecting therefore encourages patience, careful observation and an appreciation of objects that other people might discard.`,
  },
  {
    id: "synthetic-very-short", task: letterTask, source: "Original synthetic stress test",
    sourceLocation: "Not examiner-rated", publishedOverall: null, commentRanges: null,
    commentChecks: ["15-word attempted answer: public descriptors prescribe Band 1 for all criteria"],
    essay: "Dear Sir, my roommate makes noise. Please give me a quiet room. Thank you. Yours,",
  },
];
import { GetPracticeTasksResponse } from "@workspace/api-zod";

const essayInstructions = "Give reasons for your answer and include any relevant examples from your own knowledge or experience.";
const reportInstructions = "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.";
const essays = [
  {
    id: "education-technology", title: "Technology in the classroom", category: "Education",
    prompt: "Some people believe that technology has made learning more effective, while others think it has created more distractions for students.\n\nDiscuss both views and give your own opinion.",
  },
  {
    id: "cities-transport", title: "The future of urban transport", category: "Environment",
    prompt: "Many cities are investing in public transport rather than building new roads.\n\nTo what extent do you agree or disagree with this approach?",
  },
  {
    id: "work-from-home", title: "Working from home", category: "Work",
    prompt: "An increasing number of people work from home instead of travelling to an office.\n\nDo the advantages of this development outweigh the disadvantages?",
  },
  {
    id: "healthy-lifestyles", title: "Encouraging healthier lifestyles", category: "Health",
    prompt: "In many countries, people are becoming less physically active.\n\nWhat are the causes of this problem, and what measures could be taken to solve it?",
  },
];

export const practiceTasks = GetPracticeTasksResponse.parse([
  ...(["academic", "general"] as const).flatMap(module => essays.map(essay => ({
    ...essay, id: `${module}-${essay.id}`, module, task: 2, minWords: 250, minutes: 40,
    source: "sample", instructions: essayInstructions,
  }))),
  {
    id: "academic-travel", module: "academic", task: 1, title: "How people travel to work", category: "Bar chart",
    prompt: "The chart below shows the percentage of commuters using three forms of transport in a city in 2000 and 2020.",
    instructions: reportInstructions, minWords: 150, minutes: 20, source: "sample",
    visual: { kind: "chart", title: "Commuters by transport mode (%)", labels: ["Car", "Public transport", "Bicycle"],
      series: [{ name: "2000", values: [60, 30, 10] }, { name: "2020", values: [40, 40, 20] }] },
  },
  {
    id: "academic-library", module: "academic", task: 1, title: "Library use across age groups", category: "Table",
    prompt: "The table below shows the average number of library visits per person per year in three age groups in 2010 and 2020.",
    instructions: reportInstructions, minWords: 150, minutes: 20, source: "sample",
    visual: { kind: "table", title: "Average annual library visits", labels: ["18–29", "30–49", "50 and above"],
      series: [{ name: "2010", values: [12, 8, 10] }, { name: "2020", values: [6, 10, 15] }] },
  },
  {
    id: "academic-recycling", module: "academic", task: 1, title: "The paper recycling process", category: "Process",
    prompt: "The diagram below illustrates the stages involved in recycling used paper into new paper.",
    instructions: reportInstructions, minWords: 150, minutes: 20, source: "sample",
    visual: { kind: "process", title: "From used paper to new paper",
      steps: ["Collection of used paper", "Sorting and removal of unsuitable material", "Mixing with water to form pulp", "Filtering and removal of ink", "Pressing and drying", "Rolling into new paper"] },
  },
  {
    id: "academic-park", module: "academic", task: 1, title: "Changes to a public park", category: "Map",
    prompt: "The maps below show the layout of a public park in 2005 and after redevelopment in 2025. North is at the top of both maps.",
    instructions: reportInstructions, minWords: 150, minutes: 20, source: "sample",
    visual: { kind: "map", title: "Riverside Park: 2005 and 2025",
      before: ["Trees", "Pond", "Trees", "Lawn", "Footpath", "Flower garden", "Entrance", "Car park", "Lawn"],
      after: ["Trees", "Pond", "Café", "Playground", "Footpath", "Flower garden", "Entrance", "Bicycle parking", "Sports court"] },
  },
  {
    id: "general-neighbour", module: "general", task: 1, title: "A letter to your neighbour", category: "Informal letter",
    prompt: "You are planning a celebration at home and are concerned that the noise might disturb your neighbour.\n\nWrite a letter to your neighbour. In your letter:\n• explain the reason for the celebration\n• describe when it will take place\n• invite your neighbour to attend.",
    instructions: "You do not need to write any addresses. Begin your letter: Dear Alex,", minWords: 150, minutes: 20, source: "sample",
  },
  {
    id: "general-course", module: "general", task: 1, title: "Enquiring about a course", category: "Formal letter",
    prompt: "You would like to take an evening course at a local college.\n\nWrite a letter to the college administrator. In your letter:\n• explain which course you are interested in\n• ask about the timetable and fees\n• describe your relevant experience.",
    instructions: "You do not need to write any addresses. Begin your letter: Dear Sir or Madam,", minWords: 150, minutes: 20, source: "sample",
  },
  {
    id: "general-landlord", module: "general", task: 1, title: "Reporting a repair", category: "Semi-formal letter",
    prompt: "A problem with the heating in your rented apartment has not been fixed.\n\nWrite a letter to your landlord. In your letter:\n• describe the problem\n• explain how it is affecting you\n• say what you would like the landlord to do.",
    instructions: "You do not need to write any addresses. Begin your letter: Dear Mr Taylor,", minWords: 150, minutes: 20, source: "sample",
  },
]);
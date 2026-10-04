export default function Privacy() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-paper font-body text-text px-[7vw] pt-[8vh]">
      <h1 className="font-display text-primary text-[4.5vw] leading-[1.1]">Privacy boundaries</h1>
      <ul className="mt-[9vh] text-[2.2vw] space-y-[5vh] list-disc pl-[2vw] marker:text-accent leading-[1.4]">
        <li>Drafts stay in the browser by default</li>
        <li>Confirmed assessment sends the essay to OpenAI via Replit</li>
        <li>No server storage or logging of essay bodies</li>
        <li>PostgreSQL stores generated prompts and usage counts</li>
        <li>No learner accounts; provider data policies still apply</li>
      </ul>
      <div className="absolute bottom-[3vh] right-[7vw] text-[1.5vw] text-muted">07 / 09</div>
    </div>
  );
}
export default function Workflow() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-paper font-body text-text px-[7vw] pt-[8vh]">
      <h1 className="font-display text-primary text-[4.5vw] leading-[1.1]">Learner workflow</h1>
      <ol className="mt-[7vh] space-y-[3.2vh] text-[2.3vw]">
        <li className="flex gap-[3vw] items-center border-b border-primary/20 pb-[2vh]"><span className="text-accent font-display text-[3vw]">01</span><span>Choose a module and task</span></li>
        <li className="flex gap-[3vw] items-center border-b border-primary/20 pb-[2vh]"><span className="text-accent font-display text-[3vw]">02</span><span>Write alongside the prompt</span></li>
        <li className="flex gap-[3vw] items-center border-b border-primary/20 pb-[2vh]"><span className="text-accent font-display text-[3vw]">03</span><span>Track time and word count</span></li>
        <li className="flex gap-[3vw] items-center border-b border-primary/20 pb-[2vh]"><span className="text-accent font-display text-[3vw]">04</span><span>Export a copy of the draft</span></li>
        <li className="flex gap-[3vw] items-center"><span className="text-accent font-display text-[3vw]">05</span><span>Confirm AI processing to request feedback</span></li>
      </ol>
      <div className="absolute bottom-[3vh] right-[7vw] text-[1.5vw] text-muted">03 / 09</div>
    </div>
  );
}
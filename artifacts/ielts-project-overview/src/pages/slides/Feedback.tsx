export default function Feedback() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-paper font-body text-text px-[7vw] pt-[8vh]">
      <h1 className="font-display text-primary text-[4.5vw] leading-[1.1]">AI feedback</h1>
      <div className="grid grid-cols-2 gap-x-[5vw] gap-y-[5vh] mt-[9vh]">
        <p className="text-[2.3vw] border-t border-primary/30 pt-[3vh] leading-[1.4]">Task Achievement or Task Response</p>
        <p className="text-[2.3vw] border-t border-primary/30 pt-[3vh] leading-[1.4]">Coherence and Cohesion</p>
        <p className="text-[2.3vw] border-t border-primary/30 pt-[3vh] leading-[1.4]">Lexical Resource</p>
        <p className="text-[2.3vw] border-t border-primary/30 pt-[3vh] leading-[1.4]">Grammatical Range and Accuracy</p>
      </div>
      <p className="absolute bottom-[14vh] left-[7vw] w-[86vw] text-[2.3vw] font-semibold text-primary border-t-[0.4vh] border-accent pt-[4vh]">Evidence, strengths, and improvements</p>
      <div className="absolute bottom-[3vh] right-[7vw] text-[1.5vw] text-muted">05 / 09</div>
    </div>
  );
}
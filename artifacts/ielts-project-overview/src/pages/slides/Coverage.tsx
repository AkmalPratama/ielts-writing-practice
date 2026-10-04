export default function Coverage() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-paper font-body text-text px-[7vw] pt-[8vh]">
      <h1 className="font-display text-primary text-[4.5vw] leading-[1.1]">Practice coverage</h1>
      <p className="text-[2.5vw] mt-[8vh] pb-[5vh] border-b border-primary/25">Academic and General Training modules</p>
      <div className="grid grid-cols-2 gap-[6vw] mt-[6vh]">
        <p className="text-[2.5vw] leading-[1.4] border-t-[0.4vh] border-accent pt-[4vh]">Task 1: visual reports or letters</p>
        <p className="text-[2.5vw] leading-[1.4] border-t-[0.4vh] border-primary pt-[4vh]">Task 2: essay practice</p>
      </div>
      <p className="text-[2.2vw] mt-[9vh] p-[2.2vw] bg-primary/8">Original sample questions and optional AI generation</p>
      <div className="absolute bottom-[3vh] right-[7vw] text-[1.5vw] text-muted">02 / 09</div>
    </div>
  );
}
export default function Scoring() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-paper font-body text-text px-[7vw] pt-[8vh]">
      <h1 className="font-display text-primary text-[4.5vw] leading-[1.1]">Scoring limits</h1>
      <p className="text-[3vw] font-display leading-[1.3] text-primary mt-[8vh] pb-[5vh] border-b-[0.4vh] border-accent">Practice estimates, not official IELTS scores</p>
      <ul className="text-[2.2vw] mt-[6vh] space-y-[5vh] list-disc pl-[2vw] marker:text-accent leading-[1.4]">
        <li>Public May 2023 band descriptors guide the rubric</li>
        <li>Exact quotation checks do not prove score accuracy</li>
        <li>Small benchmark checks are not an accuracy guarantee</li>
      </ul>
      <div className="absolute bottom-[3vh] right-[7vw] text-[1.5vw] text-muted">06 / 09</div>
    </div>
  );
}
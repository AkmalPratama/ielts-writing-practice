export default function Readiness() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-paper font-body text-text px-[7vw] pt-[8vh]">
      <div className="absolute top-0 left-0 w-full h-[1vh] bg-primary" />
      <h1 className="font-display text-primary text-[4.5vw] leading-[1.1]">Publishing readiness</h1>
      <ul className="mt-[9vh] text-[2.2vw] space-y-[5vh] list-disc pl-[2vw] marker:text-accent leading-[1.4]">
        <li>Production builds and readiness checks passed</li>
        <li>Live-AI hosting and production database approved</li>
        <li className="font-semibold text-primary">Final publishing action remains with the owner</li>
        <li>Export preview drafts before switching to the live site</li>
        <li>Deprecated AI model; no automatic replacement</li>
      </ul>
      <div className="absolute bottom-[3vh] right-[7vw] text-[1.5vw] text-muted">09 / 09</div>
    </div>
  );
}
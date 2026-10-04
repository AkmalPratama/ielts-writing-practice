export default function Safeguards() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-paper font-body text-text px-[7vw] pt-[8vh]">
      <h1 className="font-display text-primary text-[4.5vw] leading-[1.1]">AI cost safeguards</h1>
      <ul className="mt-[9vh] text-[2.2vw] space-y-[5vh] list-disc pl-[2vw] marker:text-accent leading-[1.4]">
        <li>Approved model: OpenAI GPT-5 nano</li>
        <li className="font-semibold text-primary">Maximum 20 AI attempts per Jakarta calendar day</li>
        <li>Failed attempts count; no automatic retries</li>
        <li>Shared database reservations enforce the limit</li>
        <li>Request limit is not a dollar spending cap</li>
      </ul>
      <div className="absolute bottom-[3vh] right-[7vw] text-[1.5vw] text-muted">08 / 09</div>
    </div>
  );
}
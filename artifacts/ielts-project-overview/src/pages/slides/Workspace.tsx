const base = import.meta.env.BASE_URL;

export default function Workspace() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-paper font-body text-text px-[7vw] pt-[8vh]">
      <h1 className="font-display text-primary text-[4.5vw] leading-[1.1]">Writing workspace</h1>
      <div className="grid grid-cols-[1fr_1.1fr] gap-[5vw] mt-[8vh]">
        <ul className="text-[2.3vw] leading-[1.4] space-y-[5vh] list-disc pl-[2vw] marker:text-accent">
          <li>Side-by-side prompt and editor</li>
          <li>Browser autosave</li>
          <li>Timer and word count</li>
          <li>Sample feedback clearly labeled as an example</li>
        </ul>
        <div className="h-[60vh] border border-primary/25 bg-primary/8 p-[1vw]">
          <img src={`${base}editor.jpg`} crossOrigin="anonymous" alt="Cropped writing editor with timer and word count" className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="absolute bottom-[3vh] right-[7vw] text-[1.5vw] text-muted">04 / 09</div>
    </div>
  );
}
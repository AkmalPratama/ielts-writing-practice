const base = import.meta.env.BASE_URL;

export default function Overview() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-paper font-body text-text">
      <div className="absolute top-0 left-0 w-full h-[1vh] bg-primary" />
      <div className="absolute top-[7vh] left-[7vw] w-[86vw]">
        <h1 className="font-display text-primary text-[5.2vw] leading-[1.1] tracking-tight">IELTS Writing Practice</h1>
        <p className="text-[2.2vw] mt-[2.5vh]">A focused writing workspace with optional AI feedback.</p>
      </div>
      <div className="absolute top-[31vh] left-[7vw] w-[86vw] h-[60vh] bg-primary/10 border border-primary/20 p-[1.2vw]">
        <img src={`${base}workspace.jpg`} crossOrigin="anonymous" alt="IELTS Writing Practice task-and-editor workspace" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-[3vh] right-[7vw] text-[1.5vw] text-muted">01 / 09</div>
    </div>
  );
}
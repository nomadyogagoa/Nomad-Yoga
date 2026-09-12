"use client";
export default function Error({ reset }: { reset: () => void }) { return <div className="section"><div className="container"><p className="eyebrow">Newsletter</p><h1>We could not load the newsletter.</h1><button className="button" onClick={reset}>Try again</button></div></div>; }

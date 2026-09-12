"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { featureFlags, siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
const navItems = [
  ["Home", "/", true], ["About", "/about", true], ["Hostel", "/hostel", true], ["Programs", "/programs", featureFlags.programs], ["Reiki", "/reiki", true], ["Schedule", "/schedule", featureFlags.schedule],
  ["Instructors", "/instructors", featureFlags.instructors], ["Pricing", "/pricing", featureFlags.pricing], ["Gallery", "/gallery", featureFlags.gallery], ["Newsletter", "/newsletter", true], ["Shop", "/shop", true]
] as const;
export function Header(){
  const[open,setOpen]=useState(false);
  const[scrolled,setScrolled]=useState(false);
  const visible=navItems.filter(([, ,e])=>e);
  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>12);
    onScroll();
    window.addEventListener("scroll",onScroll,{passive:true});
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);
  return <header className={`site-header${scrolled?" is-scrolled":""}`}><div className="nav-shell"><Link className="brand brand-logo" href="/"><Image src="/images/brand/nomad-yoga-logo.png" alt="Nomad Yoga" width={52} height={52} priority /></Link><nav className="desktop-nav">{visible.map(([l,h])=><Link key={l} href={h}>{l}</Link>)}</nav><div className="nav-actions"><ThemeToggle />{featureFlags.memberLogin&&<Link className="text-button" href="/login">Login</Link>}<Link className="button button-small" href="/register">Join Us</Link></div><button className={`menu-button${open?" is-open":""}`} onClick={()=>setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}><span/><span/></button></div>{open&&<nav className="mobile-nav"><div style={{ padding: "0 10px 10px" }}><ThemeToggle /></div>{visible.map(([l,h])=><Link key={l} href={h} onClick={()=>setOpen(false)}>{l}</Link>)}<Link href="/login" onClick={()=>setOpen(false)}>Member Login</Link><Link className="button" href="/register" onClick={()=>setOpen(false)}>Join Us</Link></nav>}</header>;
}



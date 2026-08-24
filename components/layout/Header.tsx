"use client";
import { useState } from "react";
import Link from "next/link";
import { featureFlags, siteConfig } from "@/config/site";
const navItems = [
  ["Home", "/", true], ["About", "/about", true], ["Programs", "/programs", featureFlags.programs], ["Schedule", "/schedule", featureFlags.schedule],
  ["Instructors", "/instructors", featureFlags.instructors], ["Pricing", "/pricing", featureFlags.pricing], ["Gallery", "/gallery", featureFlags.gallery], ["Journal", "/blog", featureFlags.blog]
] as const;
export function Header(){const[open,setOpen]=useState(false);const visible=navItems.filter(([, ,e])=>e);return <header className="site-header"><div className="nav-shell"><Link className="brand" href="/"><span className="brand-mark">✦</span><span>{siteConfig.name}</span></Link><nav className="desktop-nav">{visible.map(([l,h])=><Link key={l} href={h}>{l}</Link>)}</nav><div className="nav-actions">{featureFlags.memberLogin&&<Link className="text-button" href="/login">Login</Link>}<Link className="button button-small" href="/register">Join Us</Link></div><button className="menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle menu"><span/><span/></button></div>{open&&<nav className="mobile-nav">{visible.map(([l,h])=><Link key={l} href={h} onClick={()=>setOpen(false)}>{l}</Link>)}<Link href="/login" onClick={()=>setOpen(false)}>Member Login</Link><Link className="button" href="/register" onClick={()=>setOpen(false)}>Join Us</Link></nav>}</header>}

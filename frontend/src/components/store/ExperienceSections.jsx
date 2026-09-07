import { useEffect, useState } from 'react'
import './experience.css'

const testimonials = [
  ['Priya Ramesh', 'Bridal couture', 'They understood the look I had in mind and improved every detail. The fitting was flawless, and every update arrived on time.'],
  ['Nandhini S', 'Designer blouse', 'The neckline, sleeve and embroidery were balanced beautifully. It felt personal from the first sketch to the final fitting.'],
  ['Meena K', 'Occasion wear', 'Clear pricing, patient fittings and a finish that looked far more luxurious than I expected.'],
]

export function PrintDesignGallery() {
  const [items,setItems]=useState([]),[category,setCategory]=useState('All'),[visible,setVisible]=useState(12),[selected,setSelected]=useState(null)
  useEffect(()=>{fetch('/api/showcase-designs').then(r=>r.ok?r.json():Promise.reject()).then(body=>setItems(body.data||[])).catch(()=>setItems([]))},[])
  const categories=['All',...new Set(items.map(item=>item.category).filter(Boolean))]
  const filtered=category==='All'?items:items.filter(item=>item.category===category)
  if(!items.length)return null
  return <section className="xp-gallery section" aria-labelledby="gallery-title"><div className="wrap"><div className="xp-title"><div><div className="eyebrow">THE DESIGN LIBRARY</div><h2 id="gallery-title">Find your<br/><em>inspiration.</em></h2></div><p>Explore real blouse, embroidery and Aari-work references from the Zivara design archive.</p></div><div className="xp-filters" role="group" aria-label="Filter designs">{categories.map(item=><button className={category===item?'active':''} onClick={()=>{setCategory(item);setVisible(12)}} key={item}>{item}</button>)}</div><div className="xp-gallery-grid">{filtered.slice(0,visible).map((item,index)=><button onClick={()=>setSelected(item)} key={item.id||item._id||item.imageUrl}><div><img src={item.imageUrl} alt={item.name||`${item.category} design`} loading={index>5?'lazy':'eager'}/><span>VIEW DESIGN ↗</span></div><small>{item.category}</small><h3>{item.name}</h3></button>)}</div>{visible<filtered.length&&<button className="xp-load" onClick={()=>setVisible(x=>x+12)}>Load more designs <span>{Math.min(visible,filtered.length)} / {filtered.length}</span></button>}</div>{selected&&<div className="xp-gallery-modal" role="dialog" aria-modal="true" onClick={()=>setSelected(null)}><article onClick={e=>e.stopPropagation()}><button onClick={()=>setSelected(null)} aria-label="Close design">×</button><img src={selected.imageUrl} alt={selected.name}/><div><small>{selected.category}</small><h2>{selected.name}</h2><a href="#contact" onClick={()=>setSelected(null)}>Create something like this →</a></div></article></div>}</section>
}

export function ServiceCollectionModal({ service, onClose }) {
  const serviceCategory={'Designer Blouses':'Pattern Blouse','Aari Work':'Aari Work','Embroidery Work':'Embroidery Work','Custom Dresses':'All'}
  const [items,setItems]=useState([]),[category,setCategory]=useState(()=>serviceCategory[service]||'All'),[selected,setSelected]=useState(null)
  useEffect(()=>{if(!service)return;fetch('/api/showcase-designs').then(r=>r.ok?r.json():Promise.reject()).then(body=>setItems(body.data||[])).catch(()=>setItems([]))},[service])
  useEffect(()=>{if(!service)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';const escape=e=>e.key==='Escape'&&(selected?setSelected(null):onClose());addEventListener('keydown',escape);return()=>{document.body.style.overflow=previous;removeEventListener('keydown',escape)}},[service,selected,onClose])
  if(!service)return null
  const categories=['All',...new Set(items.map(item=>item.category).filter(Boolean))],filtered=category==='All'?items:items.filter(item=>item.category===category)
  return <div className="service-collection-backdrop" role="dialog" aria-modal="true" aria-label={`${service} collection`} onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="service-collection-modal"><header><div><small>ZIVARA DESIGN ARCHIVE</small><h2>{service}</h2><p>Choose a category and explore every design. Click any image to view it in detail.</p></div><button onClick={onClose} aria-label="Close collections">×</button></header><div className="service-modal-filters">{categories.map(item=><button className={category===item?'active':''} onClick={()=>setCategory(item)} key={item}>{item}<span>{item==='All'?items.length:items.filter(x=>x.category===item).length}</span></button>)}</div><div className="service-modal-scroll">{items.length?<div className="service-design-grid">{filtered.map((item,index)=><button onClick={()=>setSelected(item)} key={item.id||item._id||item.imageUrl}><div><img src={item.imageUrl} alt={item.name} loading={index>7?'lazy':'eager'}/><i>View ↗</i></div><small>{item.category}</small><h3>{item.name}</h3></button>)}</div>:<div className="service-modal-loading"><i/><p>Preparing the collection…</p></div>}</div><footer><span>{filtered.length} designs in this collection</span><a href="#contact" onClick={onClose}>Book a design consultation →</a></footer></section>{selected&&<div className="service-image-view" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}><article><button onClick={()=>setSelected(null)}>×</button><img src={selected.imageUrl} alt={selected.name}/><div><small>{selected.category}</small><h3>{selected.name}</h3><a href="#contact" onClick={()=>{setSelected(null);onClose()}}>I like this design →</a></div></article></div>}</div>
}

export function CoutureShowcase() {
  const [rotation, setRotation] = useState(0)
  return <section className="xp-showcase section" aria-labelledby="showcase-title">
    <div className="wrap xp-showcase-grid">
      <div><div className="eyebrow">THE COUTURE ROOM</div><h2 id="showcase-title">See the silhouette<br/><em>from every angle.</em></h2><p>Explore a Zivara evening silhouette inspired by sculpted drape, a clean waistline and fluid movement.</p><div className="xp-controls"><button onClick={()=>setRotation(rotation-35)} aria-label="Rotate garment left">←</button><span>Drag the view</span><button onClick={()=>setRotation(rotation+35)} aria-label="Rotate garment right">→</button></div></div>
      <div className="xp-stage"><div className="xp-orbit"/><div className="xp-mannequin" style={{transform:`rotateY(${rotation}deg)`}}><i/><b/><span/></div><small>360° INTERACTIVE VIEW</small></div>
    </div>
  </section>
}

export function FitComparison() {
  const [split, setSplit] = useState(52)
  return <section className="xp-compare section wrap" aria-labelledby="fit-title">
    <div className="xp-title"><div><div className="eyebrow">THE ZIVARA DIFFERENCE</div><h2 id="fit-title">A better fit changes<br/><em>everything.</em></h2></div><p>Move the slider to compare an unstructured fit with a silhouette balanced to the client’s measurements.</p></div>
    <div className="xp-comparison" style={{'--split':`${split}%`}}>
      <div className="xp-before"><div className="xp-fit-figure loose"><i/><b/></div><span>BEFORE · READY-MADE</span></div>
      <div className="xp-after"><div className="xp-fit-figure tailored"><i/><b/></div><span>AFTER · ZIVARA FIT</span></div>
      <div className="xp-divider"><i>↔</i></div>
      <input aria-label="Compare before and after tailoring" type="range" min="15" max="85" value={split} onChange={e=>setSplit(e.target.value)}/>
    </div>
  </section>
}

export function TestimonialCarousel() {
  const [active, setActive] = useState(0)
  useEffect(()=>{const id=setInterval(()=>setActive(x=>(x+1)%testimonials.length),6500);return()=>clearInterval(id)},[])
  const item=testimonials[active]
  return <section className="testimonial xp-testimonial" aria-label="Client testimonials"><div className="wrap"><span>“</span><div className="xp-stars">★★★★★</div><blockquote>{item[2]}</blockquote><b>{item[0].split(' ').map(x=>x[0]).join('')}</b><small>{item[0]} · {item[1]}</small><div className="xp-dots">{testimonials.map((x,i)=><button aria-label={`Show review from ${x[0]}`} className={i===active?'active':''} onClick={()=>setActive(i)} key={x[0]}/>)}</div></div></section>
}

const stories = [
  ['A mother’s saree, reimagined', 'Heirloom Story', 'We preserved the original border and transformed a treasured silk saree into a contemporary reception set.'],
  ['From sketch to sangeet', 'Bridal Journey', 'A four-fitting journey brought a fluid, dance-ready bridal silhouette to life without compromising detail.'],
  ['The fit that changed everything', 'Perfect Alteration', 'Careful shoulder and waist correction gave a much-loved gown a new, confident silhouette.'],
]

export function TransformationStories() {
  const [story,setStory]=useState(null)
  return <section id="atelier" className="xp-stories section"><div className="wrap"><div className="xp-title"><div><div className="eyebrow">REAL ZIVARA STORIES</div><h2>Made personal.<br/><em>Remembered forever.</em></h2></div><p>Every garment begins with a person, an occasion and a feeling worth understanding.</p></div><div className="xp-story-grid">{stories.map((x,i)=><button onClick={()=>setStory(x)} key={x[0]}><div className={`xp-story-art story-${i}`}><span>0{i+1}</span></div><small>{x[1]}</small><h3>{x[0]}</h3><em>Read the story →</em></button>)}</div></div>
    {story&&<div className="xp-modal" role="dialog" aria-modal="true" aria-label={story[0]} onClick={()=>setStory(null)}><article onClick={e=>e.stopPropagation()}><button className="xp-close" onClick={()=>setStory(null)} aria-label="Close story">×</button><small>{story[1]}</small><h2>{story[0]}</h2><p>{story[2]}</p><a href="#contact" onClick={()=>setStory(null)}>Begin your story →</a></article></div>}
  </section>
}

const faqs=[
 ['How early should I book?', 'For bridal and detailed occasion wear, we recommend 6–10 weeks. Designer blouses and custom dresses usually need 2–4 weeks.'],
 ['Do you stitch from reference photos?', 'Yes. We study your reference, explain what works for your fabric and body proportions, then adapt it into an original Zivara fit.'],
 ['How many fittings are included?', 'Most custom orders include measurement, trial and final-fit reviews. Complex bridal pieces may include additional fittings.'],
 ['Can I bring my own fabric?', 'Absolutely. We inspect the fabric first and recommend lining, finish and silhouette based on its weight and drape.'],
]

export function JournalAndFaq() {
 const [open,setOpen]=useState(0)
 return <><section id="journal" className="xp-journal section"><div className="wrap"><div className="xp-title"><div><div className="eyebrow">THE ATELIER JOURNAL</div><h2>Notes on craft,<br/><em>fit &amp; celebration.</em></h2></div><p>Practical guidance from our studio, written to help you choose and wear better.</p></div><div className="xp-journal-grid">{[['Choosing a bridal blouse neckline','6 min read'],['Why a trial fitting matters','4 min read'],['Caring for silk after an occasion','5 min read']].map((x,i)=><article key={x[0]}><div className={`xp-journal-art journal-${i}`}/><small>ATELIER NOTES · {x[1]}</small><h3>{x[0]}</h3><a href="#contact">Ask the atelier →</a></article>)}</div></div></section>
 <section className="xp-faq section wrap"><div><div className="eyebrow">BEFORE YOU BOOK</div><h2>Questions,<br/><em>answered.</em></h2><p>Need something more specific? Our team is happy to help on WhatsApp.</p></div><div>{faqs.map((x,i)=><article className={open===i?'open':''} key={x[0]}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{x[0]}</span><b>{open===i?'−':'+'}</b></button><div><p>{x[1]}</p></div></article>)}</div></section><Newsletter/><LiveStatus/></>
}

export function Newsletter() {
 const [email,setEmail]=useState(''),[done,setDone]=useState(false)
 return <section className="xp-newsletter"><div className="wrap"><div><small>PRIVATE NOTES FROM THE ATELIER</small><h2>{done?'Welcome to the Zivara circle.':'New designs. Thoughtful styling. No noise.'}</h2></div>{!done&&<form onSubmit={e=>{e.preventDefault();setDone(true)}}><input type="email" required aria-label="Email address" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><button>Join the list →</button></form>}</div></section>
}

export function LiveStatus() {
 return <a className="xp-status" href="#contact"><i/><span><b>Atelier open today</b><small>Consultations · 10 AM–8 PM</small></span></a>
}

import { useEffect, useRef, useState } from 'react'
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
  const serviceCategoryScope={'Designer Blouses':['Pattern Blouse'],'Aari Work':['Aari Work'],'Embroidery Work':['Embroidery Work']}
  const [items,setItems]=useState([]),[selected,setSelected]=useState(null)
  useEffect(()=>{if(!service)return;fetch('/api/showcase-designs').then(r=>r.ok?r.json():Promise.reject()).then(body=>setItems(body.data||[])).catch(()=>setItems([]))},[service])
  useEffect(()=>{if(!service)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';const escape=e=>e.key==='Escape'&&(selected?setSelected(null):onClose());addEventListener('keydown',escape);return()=>{document.body.style.overflow=previous;removeEventListener('keydown',escape)}},[service,selected,onClose])
  if(!service)return null
  const scope=serviceCategoryScope[service]
  const filtered=scope?items.filter(item=>scope.includes(item.category)):items
  return <div className="service-collection-backdrop" role="dialog" aria-modal="true" aria-label={`${service} collection`} onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="service-collection-modal"><header><div><small>ZIVARA DESIGN ARCHIVE</small><h2>{service}</h2><p>Explore every design in this collection. Click any image to view it in detail.</p></div><button onClick={onClose} aria-label="Close collections">×</button></header><div className="service-modal-scroll">{items.length?<div className="service-design-grid">{filtered.map((item,index)=><button onClick={()=>setSelected(item)} key={item.id||item._id||item.imageUrl}><div><img src={item.imageUrl} alt={item.name} loading={index>7?'lazy':'eager'}/><i>View ↗</i></div><h3>{item.name}</h3></button>)}</div>:<div className="service-modal-loading"><i/><p>Preparing the collection…</p></div>}</div><footer><span>{filtered.length} designs in this collection</span></footer></section>{selected&&<div className="service-image-view" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}><article><button onClick={()=>setSelected(null)}>×</button><img src={selected.imageUrl} alt={selected.name}/><div><small>{selected.category}</small><h3>{selected.name}</h3><a href="#contact" onClick={()=>{setSelected(null);onClose()}}>I like this design →</a></div></article></div>}</div>
}

const GOWN_SPIN_FRAMES = 8
const gownSpinSrc = (n) => `/gown-spin/${String(n).padStart(3, '0')}.webp`

export function CoutureShowcase() {
  const [frame, setFrame] = useState(1)
  const drag = useRef(null)
  useEffect(() => {
    for (let i = 1; i <= GOWN_SPIN_FRAMES; i++) {
      const img = new window.Image()
      img.src = gownSpinSrc(i)
    }
  }, [])
  const wrap = (n) => ((n - 1) % GOWN_SPIN_FRAMES + GOWN_SPIN_FRAMES) % GOWN_SPIN_FRAMES + 1
  const step = (delta) => setFrame((f) => wrap(f + delta))
  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, frame }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    const framesMoved = Math.round((e.clientX - drag.current.x) / 50)
    setFrame(wrap(drag.current.frame - framesMoved))
  }
  const onPointerUp = () => { drag.current = null }
  return <section className="xp-showcase section" aria-labelledby="showcase-title">
    <div className="wrap xp-showcase-grid">
      <div><div className="eyebrow">THE COUTURE ROOM</div><h2 id="showcase-title">See the silhouette<br/><em>from every angle.</em></h2><p>Drag to rotate this beaded party gown — a real 360° view of an actual Zivara piece.</p><div className="xp-controls"><button onClick={()=>step(-1)} aria-label="Rotate left">←</button><span>Drag to rotate</span><button onClick={()=>step(1)} aria-label="Rotate right">→</button></div></div>
      <div className="xp-stage xp-stage-spin" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}><img src={gownSpinSrc(frame)} alt="360 view of beaded party gown" draggable="false"/></div>
    </div>
  </section>
}

export function FitComparison() {
  const [split, setSplit] = useState(50)
  return <section className="xp-feature section wrap" aria-labelledby="fit-title">
    <div className="xp-feature-copy">
      <div className="eyebrow">THE ZIVARA DIFFERENCE</div>
      <h2 id="fit-title">From simple to party wear,<br/><em>we stitch it all.</em></h2>
      <p>Move the slider to see a simple silhouette transform into a fully embellished occasion piece — same measurements, same care.</p>
    </div>
    <div className="xp-comparison" style={{'--split':`${split}%`}}>
      <div className="xp-before"><img src="/zivara-gown-simple.webp" alt="Simple everyday silhouette"/><span>SIMPLE</span></div>
      <div className="xp-after"><img src="/zivara-gown-feature.webp" alt="Grand embellished gown"/><span>GRAND</span></div>
      <div className="xp-divider"><i>↔</i></div>
      <input aria-label="Compare simple and grand styles" type="range" min="0" max="100" value={split} onChange={e=>setSplit(e.target.value)}/>
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
  return <section className="xp-stories section"><div className="wrap"><div className="xp-title"><div><div className="eyebrow">REAL ZIVARA STORIES</div><h2>Made personal.<br/><em>Remembered forever.</em></h2></div><p>Every garment begins with a person, an occasion and a feeling worth understanding.</p></div><div className="xp-story-grid">{stories.map((x,i)=><button onClick={()=>setStory(x)} key={x[0]}><div className={`xp-story-art story-${i}`}><span>0{i+1}</span></div><small>{x[1]}</small><h3>{x[0]}</h3><em>Read the story →</em></button>)}</div></div>
    {story&&<div className="xp-modal" role="dialog" aria-modal="true" aria-label={story[0]} onClick={()=>setStory(null)}><article onClick={e=>e.stopPropagation()}><button className="xp-close" onClick={()=>setStory(null)} aria-label="Close story">×</button><small>{story[1]}</small><h2>{story[0]}</h2><p>{story[2]}</p><a href="#contact" onClick={()=>setStory(null)}>Begin your story →</a></article></div>}
  </section>
}

const faqs=[
 ['How early should I book?', 'Regular stitching needs just 4 days. Occasion wear needs 1–2 weeks. Bridal work like Aari, embroidery and gowns needs 3–4 weeks.'],
 ['Do you stitch from reference photos?', 'Yes. We study your reference, explain what works for your fabric and body proportions, then adapt it into an original Zivara fit.'],
 ['How many fittings are included?', 'Most custom orders include measurement, trial and final-fit reviews. Complex bridal pieces may include additional fittings.'],
 ["What if I don't know my measurements?", "No problem — you can bring an old blouse or garment that fits you well, even one that just needs a small alteration, and we'll use it as reference. We also take your measurements ourselves at the shop."],
 ['How much does stitching cost?', 'Pricing depends on the fabric, design and embellishment you choose. Visit us or share a reference photo on WhatsApp for an exact quote.'],
]

export function JournalAndFaq() {
 const [open,setOpen]=useState(0)
 return <><section id="journal" className="xp-faq section wrap"><div><div className="eyebrow">BEFORE YOU BOOK</div><h2>Questions,<br/><em>answered.</em></h2><p>Need something more specific? Our team is happy to help on WhatsApp.</p></div><div>{faqs.map((x,i)=><article className={open===i?'open':''} key={x[0]}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{x[0]}</span><b>{open===i?'−':'+'}</b></button><div><p>{x[1]}</p></div></article>)}</div></section><Newsletter/><LiveStatus/></>
}

export function Newsletter() {
 const [phone,setPhone]=useState(''),[done,setDone]=useState(false),[busy,setBusy]=useState(false)
 const submit=async e=>{
  e.preventDefault()
  setBusy(true)
  try{
   await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'WhatsApp Rate Request',phone,service:'Rate Card',message:'Requested normal stitching rates via WhatsApp',source:'Rate Card Widget'})})
  }catch{}
  const text=encodeURIComponent(`Hi, Please send me your rate card. My number is ${phone}.`)
  window.open(`https://wa.me/918220364840?text=${text}`,'_blank')
  setDone(true)
  setBusy(false)
 }
 return <section className="xp-newsletter"><div className="wrap"><div><small>GET OUR RATE CARD</small><h2>{done?'Check WhatsApp — just tap send!':'Know our stitching rates, instantly.'}</h2></div>{!done&&<form onSubmit={submit}><input type="tel" required aria-label="WhatsApp number" placeholder="Your WhatsApp number" value={phone} onChange={e=>setPhone(e.target.value)}/><button disabled={busy}>Send me the rates →</button></form>}</div></section>
}

export function LiveStatus() {
 const isSunday=new Date().getDay()===0
 return <a className={"xp-status"+(isSunday?' closed':'')} href="#contact"><i/><span><b>{isSunday?'Closed today':'Open today'}</b><small>{isSunday?'Opens Monday · 10:30 AM–8 PM':'10:30 AM–8 PM'}</small></span></a>
}

import {useState,useEffect,useRef} from 'react'
import {Link,NavLink,Navigate,useLocation} from 'react-router-dom'
import {useApp,ST,money,iso} from './store.jsx'
import {ALT} from './data.js'
import {I18n} from './i18n.jsx'

export const shots=item=>item.photos?.length?item.photos:[item.tone||ALT[0],...ALT.slice(0,3)].map(tone=>({tone}))
const P={dress:'M9 3l3 2 3-2 1 3-1 4 4 11H5l4-11-1-4z',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',cart:'M3 4h3l2 11h10l2-8H7',shield:'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z',tag:'M3 12V4h8l10 10-8 8z',user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',truck:'M2 6h12v10H2zM14 10h5l3 3v3h-8z',heart:'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.500-7 10-7 10z'}
export const Icon=({n,on})=><svg className="ico" viewBox="0 0 24 24" fill={on?'currentColor':'none'} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d={P[n]}/></svg>

export const Photo=({shot,item,big})=><div className={'ph'+(big?' big':'')} style={{background:`linear-gradient(170deg,${shot.tone},#ffffffaa)`}}>{shot.src?<img src={shot.src} alt={item.name}/>:<Mark ghost/>}</div>
export const StatusBadge=({s})=><span className={'badge '+ST[s][1]}>{ST[s][0]}</span>
export const ItemCard=({item})=>{const {favs,toggleFav}=useApp();return <article className="card"><div className="ph-wrap"><Link to={'/catalog/'+item.id}><Photo shot={shots(item)[0]} item={item} v={item.id}/></Link>
 <button className="heart" onClick={()=>toggleFav(item.id)} aria-label="В избранное"><Icon n="heart" on={favs.includes(item.id)}/></button><StatusBadge s={item.status}/></div>
 <h3>{item.name}</h3><small>Арт. {item.article} · Размер {item.size}</small>
 <p>Аренда: {money(item.rent)} / день<br/>Покупка: {money(item.sale)}</p><Link className="btn out full" to={'/catalog/'+item.id}>Подробнее</Link></article>}

export const Mark=({ghost,size=42})=><svg viewBox="0 0 64 64" width={ghost?undefined:size} height={ghost?undefined:size} className={ghost?'ghost':'mark'} fill="none" strokeLinecap="round" aria-hidden="true">
 <defs><linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D9B97E"/><stop offset="1" stopColor="#A97593"/></linearGradient></defs>
 <g stroke="url(#gm)" strokeWidth="1.5"><path d="M32 17C27 28 25 39 23 51h18c-2-12-4-23-9-34z"/><path d="M32 22v29" strokeWidth=".8"/><path d="M18 54q14 5 28 0"/><path d="M17 51C8 43 8 29 15 21"/><path d="M47 51c9-8 9-22 2-30"/></g>
 <g fill="url(#gm)"><path d="M32 2l1.8 5.2L39 9l-5.2 1.8L32 16l-1.8-5.2L25 9l5.2-1.8z"/>
 {[[10,40,-70],[9,32,-85],[11,25,-110],[14,21,-130]].map(([x,y,a],i)=><g key={i}><ellipse cx={x} cy={y} rx="3.4" ry="1.5" transform={`rotate(${a} ${x} ${y})`}/><ellipse cx={64-x} cy={y} rx="3.4" ry="1.5" transform={`rotate(${-a} ${64-x} ${y})`}/></g>)}</g></svg>
export const Logo=()=><Link to="/" className="logo" aria-label="Kyz Uzatu"><Mark/><span><b>Kyz Uzatu</b><small>салон платьев</small></span></Link>

const SP=[...Array(18)].map((_,i)=>({k:i%3===0?'petal':'star',x:(i*37)%100,y:(i*53)%92,s:i%3===0?11+(i%3)*4:8+(i%4)*5,d:16+(i%5)*5,dl:-(i*2.7)}))
export const Magic=()=><div className="magic" aria-hidden="true"><div className="aurora"><i/><i/><i/></div>{SP.map((p,i)=><span key={i} className={'sp '+p.k} style={{'--x':p.x+'%','--y':p.y+'%','--s':p.s+'px','--d':p.d+'s','--dl':p.dl+'s'}}/>)}</div>
export function Reveal({children}){const r=useRef(),[v,setV]=useState(false)
 useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect()}},{threshold:.1});o.observe(r.current);return()=>o.disconnect()},[])
 return <div ref={r} className={'rv'+(v?' in':'')}>{children}</div>}
export function Navbar(){
 const {user,logout,lang,setLang}=useApp(),[open,setOpen]=useState(false)
 const panel=user&&{client:['/my-orders','Мои заказы'],manager:['/manager','Панель менеджера'],owner:['/admin','Панель владельца']}[user.role]
 return <header className="nav"><div className="wrap nav-in"><Logo/>
  <button className="burger" onClick={()=>setOpen(!open)} aria-label="Меню">☰</button>
  <nav className={open?'links open':'links'} onClick={()=>setOpen(false)}>
   <NavLink to="/" end>Главная</NavLink><NavLink to="/catalog">Каталог</NavLink><a href="#contacts">Контакты</a>
   {panel&&<NavLink to={panel[0]}>{panel[1]}</NavLink>}
   <button className="lang" onClick={()=>setLang(lang==='kk'?'ru':'kk')} aria-label="Language">{lang==='kk'?'РУС':'ҚАЗ'}</button>
   {user?<><span className="hi"><Icon n="user"/>{user.name}</span><button className="btn sm out" onClick={logout}>Выйти</button></>
   :<><Link className="hi" to="/login"><Icon n="user"/>Войти</Link><Link className="btn sm" to="/register">Регистрация</Link></>}
  </nav></div></header>}
export const Footer=()=><footer id="contacts"><div className="wrap foot"><div><Logo/><p>Сделай свой день особенным</p></div>
 <div><h4>Контакты</h4><p>+7 700 123 45 67<br/>info@kyzuzatu.kz<br/>Алматы, ул. Абая 123</p></div><div><h4>Мы в соцсетях</h4><p>Instagram: kyz_uzatu_koilekteri<br/>WhatsApp</p></div></div><p className="copy">© 2026 Kyz Uzatu. Все права защищены. Учебный проект.</p></footer>
export const Layout=({children})=><><Magic/><I18n/><Navbar/><main>{children}</main><Footer/></>

export function Calendar({id,sel,onPick}){
 const {dayState,lang}=useApp(),[m,setM]=useState(()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1)}),t=iso(new Date())
 const y=m.getFullYear(),mo=m.getMonth(),n=new Date(y,mo+1,0).getDate(),off=(m.getDay()+6)%7
 const key=d=>`${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
 const click=k=>(!sel.from||sel.to||k<sel.from)?onPick({from:k,to:null}):onPick({from:sel.from,to:k})
 return <div className="cal"><div className="cal-h"><button onClick={()=>setM(new Date(y,mo-1,1))} aria-label="Назад">‹</button><b>{m.toLocaleDateString(lang==='kk'?'kk-KZ':'ru-RU',{month:'long',year:'numeric'})}</b><button onClick={()=>setM(new Date(y,mo+1,1))} aria-label="Вперёд">›</button></div>
 <div className="cal-g">{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d=><i key={d}>{d}</i>)}{Array(off).fill(0).map((_,i)=><span key={'o'+i}/>)}
 {Array.from({length:n},(_,i)=>{const k=key(i+1),st=dayState(id,k),past=k<t,on=sel.from&&k>=sel.from&&k<=(sel.to||sel.from)
  return <button key={k} disabled={!!st||past} onClick={()=>click(k)} className={st==='busy'?'d-busy':st?'d-clean':on?'d-on':past?'d-past':'d-free'}>{i+1}</button>})}</div>
 <div className="legend"><span className="d-free"/>Свободно<span className="d-busy"/>Занято<span className="d-clean"/>Чистка / подготовка<span className="d-on"/>Выбрано</div></div>}

export function Protected({roles,children}){const {user}=useApp(),loc=useLocation()
 if(!user)return <Navigate to="/login" state={{from:loc.pathname+loc.search}} replace/>
 return !roles||roles.includes(user.role)?children:<Navigate to="/" replace/>}

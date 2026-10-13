import {useState,useEffect} from 'react'
import {QRCodeSVG} from 'qrcode.react'
import {Link,useParams,useNavigate,useLocation,useSearchParams} from 'react-router-dom'
import {useApp,ST,NEXT,money,iso,days,readPhoto,codeOf} from './store.jsx'
import {Photo,StatusBadge,ItemCard,Calendar,Icon,Mark,Reveal,shots} from './components.jsx'

// Фон страницы (.tone) плавно меняет цвет вслед за главным фото
export function Home(){const {items}=useApp(),[i,setI]=useState(0),S=items.slice(0,3)
 useEffect(()=>{if(S.length<2)return;const t=setInterval(()=>setI(x=>(x+1)%S.length),6500);return()=>clearInterval(t)},[S.length])
 if(!S.length)return <section className="wrap sec"><h1>Каталог пока пуст</h1></section>
 const cur=S[i%S.length]
 return <div className="tone" style={{'--tone':shots(cur)[0].tone}}>
 <section className="wrap hero"><div className="hero-t"><h1>Твоя свадьба — как сказка</h1><p>Аренда и покупка платьев для кыз узату — без путаницы и двойных броней</p>
  <div className="cta"><Link className="btn" to="/catalog">Выбрать платье</Link><a className="btn out" href="#how">Как это работает</a></div></div>
  <div className="stage"><div className="frame"><div className="slides">{S.map((it,k)=><Link to={'/catalog/'+it.id} key={it.id} className={'slide'+(k===i?' on':'')} tabIndex={k===i?0:-1} aria-label={it.name}><Photo shot={shots(it)[0]} item={it}/></Link>)}</div></div>
   {[1,2].filter(n=>n<S.length).map(n=>{const k=(i+n)%S.length,it=S[k];return <button key={n} className={'bubble b'+n} onClick={()=>setI(k)} aria-label={it.name}><Photo shot={shots(it)[0]} item={it}/></button>})}
   <div className="cap"><b>{cur.name}</b><small>от {money(cur.rent)} / день</small></div></div></section>
 <Reveal><section className="marq" aria-label="Платья салона"><div className="track">{[...items,...items].map((it,k)=><Link key={k} to={'/catalog/'+it.id} tabIndex={k>=items.length?-1:0} aria-label={it.name}><Photo shot={shots(it)[0]} item={it}/></Link>)}</div></section></Reveal>
 <Reveal><section id="how" className="wrap sec cen"><h2>Как это работает</h2><div className="cols3">{[['dress','Выберите платье','Из каталога — аренда или покупка'],['cal','Выберите даты','Система сама проверит, свободно ли платье'],['cart','Оформите заказ','Менеджер подтвердит бронь и подготовит платье']].map(([ic,t,d])=><div className="how" key={t}><span className="circle"><Icon n={ic}/></span><h3>{t}</h3><p>{d}</p></div>)}</div></section></Reveal>
 <Reveal><section className="wrap sec cen"><h2>Популярные платья</h2><div className="grid">{items.slice(0,4).map(x=><ItemCard key={x.id} item={x}/>)}</div><p className="more"><Link className="btn out" to="/catalog">Смотреть все платья</Link></p></section></Reveal>
 <Reveal><section className="wrap sec cen"><h2>Почему мы</h2><div className="cols4">{[['cal','Актуальные даты','Свободные и занятые дни видны сразу'],['tag','Аренда и покупка','Оба варианта в одном месте'],['user','Индивидуальный подход','Поможем подобрать образ'],['truck','Доставка по Казахстану','Быстро и надёжно']].map(([ic,t,d])=><div className="why" key={t}><Icon n={ic}/><b>{t}</b><small>{d}</small></div>)}</div></section></Reveal></div>}

export function Catalog(){const {items,favs}=useApp(),[q,setQ]=useState(''),[size,setSize]=useState(''),[color,setColor]=useState(''),[av,setAv]=useState(''),[sort,setSort]=useState('new'),[pg,setPg]=useState(1)
 const colors=[...new Set(items.map(i=>i.color))].filter(c=>c!=='—')
 const SORT={new:(a,b)=>b.id-a.id,low:(a,b)=>a.rent-b.rent,high:(a,b)=>b.rent-a.rent,name:(a,b)=>a.name.localeCompare(b.name,'ru')}
 const list=items.filter(i=>(i.name+' '+i.article).toLowerCase().includes(q.toLowerCase())&&(!size||i.size===size)&&(!color||i.color===color)&&(!av||(av==='fav'?favs.includes(i.id):i.status==='available'))).sort(SORT[sort])
 const N=12,pages=Math.ceil(list.length/N)||1,cur=Math.min(pg,pages),view=list.slice((cur-1)*N,cur*N),f=set=>e=>{set(e.target.value);setPg(1)}
 return <><section className="banner"><h1>Каталог платьев</h1><p>Найдите платье своей мечты</p></section>
 <div className="wrap sec"><input className="search" placeholder="Поиск по названию, артикулу…" value={q} onChange={f(setQ)}/>
 <div className="chips">{['',...colors].map(c=><button key={c} className={color===c?'on':''} onClick={()=>{setColor(c);setPg(1)}}>{c||'Все'}</button>)}</div>
 <div className="filters"><label>Размер<select value={size} onChange={f(setSize)}><option value="">Все</option>{['S','M','L'].map(s=><option key={s}>{s}</option>)}</select></label>
  <label>Показать<select value={av} onChange={f(setAv)}><option value="">Все</option><option value="av">Только в наличии</option><option value="fav">Избранное</option></select></label>
  <label>Сортировка<select value={sort} onChange={f(setSort)}><option value="new">Сначала новые</option><option value="low">Аренда: дешевле</option><option value="high">Аренда: дороже</option><option value="name">По названию</option></select></label></div>
 {view.length?<div className="grid">{view.map(i=><ItemCard key={i.id} item={i}/>)}</div>:<p>Ничего не найдено. Измените фильтры или поиск.</p>}
 {pages>1&&<div className="pager">{Array.from({length:pages},(_,k)=><button key={k} className={k+1===cur?'on':''} onClick={()=>setPg(k+1)}>{k+1}</button>)}</div>}</div></>}

const SPECS=item=>({Цвет:item.color,Размер:item.size,Артикул:item.article,...item.specs})
export function ItemPage(){const {id}=useParams(),{items,user,favs,toggleFav}=useApp(),nav=useNavigate(),[sel,setSel]=useState({from:null,to:null}),[k,setK]=useState(0)
 const item=items.find(x=>x.id===+id);if(!item)return <p className="wrap sec">Вещь не найдена</p>
 const S=shots(item),d=sel.from&&sel.to?days(sel.from,sel.to):0,sold=item.status==='sold'
 return <div className="tone" style={{'--tone':S[k].tone}}><div className="tone-fade"><div className="wrap sec">
  <nav className="crumbs"><Link to="/catalog">Каталог</Link> / {item.name}</nav>
  <div className="item"><div className="gal"><Photo shot={S[k]} item={item} v={k} big key={k}/>{S.length>1&&<div className="thumbs">{S.map((s,j)=><button key={j} className={j===k?'on':''} onClick={()=>setK(j)} aria-label={'Фото '+(j+1)}><Photo shot={s} item={item} v={j}/></button>)}</div>}</div>
   <div><div className="row"><h1>{item.name}</h1><button className="heart in" onClick={()=>toggleFav(item.id)} aria-label="В избранное"><Icon n="heart" on={favs.includes(item.id)}/></button></div>
    <p><small>Арт. {item.article}</small> <StatusBadge s={item.status}/></p>
    <dl className="props"><dt>Размер</dt><dd>{item.size}</dd><dt>Аренда</dt><dd>{money(item.rent)} / день</dd><dt>Покупка</dt><dd>{money(item.sale)}</dd></dl>
    <p>{item.desc||'Платье для кыз узату. Детали и примерка — у менеджера салона.'}</p>
    <h3>Характеристики</h3><dl className="props">{Object.entries(SPECS(item)).map(([a,b])=><span key={a} className="pair"><dt>{a}</dt><dd>{b}</dd></span>)}</dl></div></div>
  <h2>Доступность</h2><div className="avail"><div className="box"><Calendar id={item.id} sel={sel} onPick={setSel}/></div>
   <div className="box"><h3>Выбранные даты</h3><p>{sel.from?`${sel.from} — ${sel.to||'выберите дату возврата'}`:'Выберите даты в календаре'}</p>
    {d>0&&<><p>Длительность: {d} дн.</p><p className="total">{money(d*item.rent)}</p></>}
    <div className="two"><button className="btn" disabled={!d||sold} onClick={()=>nav(`/checkout/${item.id}?type=rent&from=${sel.from}&to=${sel.to}`)}>Арендовать</button>
    <button className="btn out" disabled={sold} onClick={()=>nav(`/checkout/${item.id}?type=sale`)}>Купить</button></div>
    {!user&&<small>Чтобы оформить заказ, войдите в аккаунт.</small>}</div></div></div></div></div>}

export function Checkout(){const {id}=useParams(),[q]=useSearchParams(),{items,user,placeOrder}=useApp(),nav=useNavigate()
 const item=items.find(x=>x.id===+id),[type,setType]=useState(q.get('type')||'rent'),[from,setFrom]=useState(q.get('from')||''),[to,setTo]=useState(q.get('to')||'')
 const [phone,setPhone]=useState(''),[note,setNote]=useState(''),[name,setName]=useState(user.name),[err,setErr]=useState(null)
 if(!item)return <p className="wrap sec">Вещь не найдена</p>
 const d=from&&to&&to>=from?days(from,to):0,total=type==='rent'?d*item.rent:item.sale
 const submit=e=>{e.preventDefault();setErr(null)
  if(type==='rent'&&!d)return setErr({msg:'Выберите корректные даты аренды.'})
  const r=placeOrder({itemId:item.id,type,from,to,phone,note,total:total||0});if(r.ok)nav('/my-orders');else setErr({msg:'Эти даты заняты. Ближайшие свободные:',slots:r.slots})}
 return <form className="wrap sec co" onSubmit={submit}><h1>Оформление заказа</h1>
  <div className="box"><h3>Ваш заказ</h3><div className="mini"><Photo shot={shots(item)[0]} item={item} v={item.id}/><div><b>{item.name}</b><br/><small>Арт. {item.article} · Размер {item.size}</small></div></div>
   <div className="seg"><button type="button" className={type==='rent'?'on':''} onClick={()=>setType('rent')}>Аренда</button><button type="button" className={type==='sale'?'on':''} disabled={item.status==='sold'} onClick={()=>setType('sale')}>Покупка</button></div>
   {type==='rent'&&<div className="two"><label>Дата выдачи<input type="date" required value={from} min={iso(new Date())} onChange={e=>setFrom(e.target.value)}/></label><label>Дата возврата<input type="date" required value={to} min={from} onChange={e=>setTo(e.target.value)}/></label></div>}
   <h3>Данные клиента</h3><label>ФИО<input required value={name} onChange={e=>setName(e.target.value)}/></label>
   <label>Телефон<input required placeholder="+7 700 123 45 67" value={phone} onChange={e=>setPhone(e.target.value)}/></label>
   <label>Комментарий (необязательно)<textarea value={note} onChange={e=>setNote(e.target.value)}/></label></div>
  <div><div className="box note"><h3>Ваш особенный день — в надёжных руках</h3><p><small>Бережное отношение к каждому платью<br/>Профессиональная химчистка<br/>Своевременная доставка по Казахстану</small></p></div>
   <div className="box"><h3>Итог</h3><p>{type==='rent'?`Аренда (${d} дн.)`:'Покупка'}</p><p className="total">{money(total||0)}</p>
   <p><small>Предоплата (30%): {money(Math.round((total||0)*0.3))}</small><br/><small>Реквизиты для предоплаты пришлёт менеджер в WhatsApp.</small></p>
   {err&&<div className="err">{err.msg}{err.slots?.map(([a,b])=><button type="button" key={a} className="btn sm out" onClick={()=>{setFrom(a);setTo(b);setErr(null)}}>{a} — {b}</button>)}</div>}
   <button className="btn full">Подтвердить заказ</button></div></div></form>}

export function MyOrders(){const {orders,items,user}=useApp(),[f,setF]=useState('')
 const list=orders.filter(o=>o.userId===user.id&&(!f||o.type===f))
 return <div className="wrap sec"><h1>Мои заказы</h1><div className="seg">{[['','Все'],['rent','Аренда'],['sale','Покупка']].map(([k,l])=><button key={k} className={f===k?'on':''} onClick={()=>setF(k)}>{l}</button>)}</div>
 <div className="tw"><table><thead><tr><th>Платье</th><th>Даты</th><th>Тип</th><th>Статус</th><th>Предоплата</th></tr></thead><tbody>{list.map(o=>{const i=items.find(x=>x.id===o.itemId)
  return <tr key={o.id}><td><Link to={'/catalog/'+i.id}>{i.name}</Link></td><td>{o.type==='rent'?`${o.from} — ${o.to}`:'—'}</td><td>{o.type==='rent'?'Аренда':'Покупка'}</td><td><StatusBadge s={o.status}/></td><td>{o.prepay?<>{money(o.prepay)} <small>{o.paid?'оплачена':'ожидается'}</small></>:'—'}</td></tr>})}</tbody></table>
 {!list.length&&<p style={{padding:16}}>Заказов пока нет. <Link to="/catalog">Выбрать платье</Link></p>}</div></div>}

export function Auth({register}){const {items,login,register:reg}=useApp(),nav=useNavigate(),loc=useLocation(),[f,setF]=useState({name:'',email:'',password:''}),[err,setErr]=useState(''),[k,setK]=useState(0)
 const imgs=items.map(i=>shots(i)[0]).filter(s=>s.src).slice(0,4)
 useEffect(()=>{if(imgs.length<2)return;const t=setInterval(()=>setK(x=>(x+1)%imgs.length),5500);return()=>clearInterval(t)},[imgs.length])
 const go=ok=>ok?nav(loc.state?.from||'/',{replace:true}):setErr(register?'Этот email уже зарегистрирован.':'Неверный email или пароль.')
 const submit=e=>{e.preventDefault();go(register?reg(f.name,f.email,f.password):login(f.email,f.password))}
 const set=k=>e=>setF({...f,[k]:e.target.value})
 return <div className="auth"><div className="auth-img">{imgs.map((s,j)=><img key={s.src} src={s.src} alt="" className={j===k?'on':''}/>)}<div className="auth-cap"><Mark size={56}/><b>Kyz Uzatu</b><p>Каждая девушка достойна сказочной свадьбы</p></div></div>
  <form className="auth-form" onSubmit={submit}><h1>{register?'Регистрация':'Добро пожаловать'}</h1><p className="muted">{register?'Создайте аккаунт, чтобы бронировать платья':'Войдите, чтобы увидеть свои заказы и избранное'}</p>
  {register&&<label>Имя<input required value={f.name} onChange={set('name')}/></label>}
  <label>Email<input type="email" required placeholder="example@mail.kz" value={f.email} onChange={set('email')}/></label>
  <label>Пароль<input type="password" required minLength={4} value={f.password} onChange={set('password')}/></label>
  {err&&<div className="err">{err}</div>}<button className="btn full">{register?'Создать аккаунт':'Войти'}</button>
  <p className="muted">{register?<>Уже есть аккаунт? <Link to="/login">Войти</Link></>:<>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></>}</p>
  {!register&&<div className="demo"><small>Демо-вход:</small>{[['Клиент','client@kyz.kz'],['Менеджер','manager@kyz.kz'],['Владелец','owner@kyz.kz']].map(([l,e])=><button type="button" key={e} className="btn sm out" onClick={()=>go(login(e,'1234'))}>{l}</button>)}</div>}</form></div>}

function Orders(){const {orders,items,users,setOrderStatus,markPaid}=useApp(),[f,setF]=useState(''),[q,setQ]=useState('')
 const nm=o=>items.find(i=>i.id===o.itemId).name,list=orders.filter(o=>(!f||o.status===f)&&nm(o).toLowerCase().includes(q.toLowerCase()))
 // WhatsApp: открывает чат с клиентом и готовый текст сообщения
 const wa=(o,kind)=>{const u=users.find(x=>x.id===o.userId)?.name||'',d=o.type==='rent'?` на даты ${o.from} — ${o.to}`:''
  const txt={ok:`Здравствуйте, ${u}! Подтверждаем бронь платья «${nm(o)}»${d}. Ждём вас в салоне Kyz Uzatu.`,ask:`Здравствуйте, ${u}! Получили заявку на платье «${nm(o)}»${d}. Предоплата ${money(o.prepay||0)}, реквизиты пришлём здесь.`,back:`Здравствуйте, ${u}! Напоминаем: платье «${nm(o)}» нужно вернуть ${o.to}. Спасибо!`}[kind]
  window.open(`https://wa.me/${(o.phone||'').replace(/\D/g,'')}?text=${encodeURIComponent(txt)}`,'_blank')}
 return <><div className="filters"><input className="search" placeholder="Поиск по платью" value={q} onChange={e=>setQ(e.target.value)}/>
  <select value={f} onChange={e=>setF(e.target.value)}><option value="">Все статусы</option>{['pending','confirmed','cancelled'].map(s=><option key={s} value={s}>{ST[s][0]}</option>)}</select></div>
 <div className="tw"><table><thead><tr><th>Клиент</th><th>Платье</th><th>Даты</th><th>Тип</th><th>Статус</th><th>Предоплата</th><th>Действия</th></tr></thead><tbody>{list.map(o=><tr key={o.id}>
  <td>{users.find(u=>u.id===o.userId)?.name}<br/><small>{o.phone}</small></td><td>{nm(o)}</td><td>{o.type==='rent'?`${o.from} — ${o.to}`:'—'}</td><td>{o.type==='rent'?'Аренда':'Покупка'}</td><td><StatusBadge s={o.status}/></td>
  <td>{o.prepay?<>{money(o.prepay)}<br/><small>{o.paid?'оплачена':'ожидается'}</small></>:'—'}</td>
  <td><div className="acts">{o.status==='pending'&&<><button className="btn sm" onClick={()=>setOrderStatus(o.id,'confirmed')}>Подтвердить</button><button className="btn sm out" onClick={()=>setOrderStatus(o.id,'cancelled')}>Отменить</button></>}
   {!!o.prepay&&!o.paid&&o.status!=='cancelled'&&<button className="btn sm out" onClick={()=>markPaid(o.id)}>Предоплата получена</button>}
   {o.status!=='cancelled'&&<button className="btn sm out" onClick={()=>wa(o,o.status==='pending'?'ask':'ok')}>WhatsApp: {o.status==='pending'?'запрос':'подтверждение'}</button>}
   {o.type==='rent'&&o.status==='confirmed'&&<button className="btn sm out" onClick={()=>wa(o,'back')}>WhatsApp: возврат</button>}</div></td></tr>)}</tbody></table></div></>}

function ItemsTable({onEdit}){const {items,orders,setItemStatus,deleteItem}=useApp()
 const del=i=>{const n=orders.filter(o=>o.itemId===i.id).length;if(window.confirm(`Удалить платье «${i.name}»?`+(n?` Заказы на него (${n}) тоже будут удалены.`:'')))deleteItem(i.id)}
 return <><p className="muted">Статусы: В наличии → Забронировано → В аренде → На чистке → В наличии</p>
 <div className="tw"><table><thead><tr><th>Платье</th><th>Арт.</th><th>Размер</th><th>Фото</th><th>Статус</th><th>Действия</th></tr></thead><tbody>{items.map(i=><tr key={i.id}><td className="thumbrow"><Photo shot={shots(i)[0]} item={i}/>{i.name}</td><td>{i.article}</td><td>{i.size}</td><td>{i.photos?.length||0}</td><td><StatusBadge s={i.status}/></td>
  <td className="acts">{NEXT[i.status]&&<button className="btn sm" onClick={()=>setItemStatus(i.id,NEXT[i.status])}>→ {ST[NEXT[i.status]][0]}</button>}<button className="btn sm out" onClick={()=>onEdit(i)}>Изменить</button><button className="btn sm out danger" onClick={()=>del(i)}>Удалить</button></td></tr>)}</tbody></table></div></>}

function Clients(){const {users,orders}=useApp()
 return <div className="tw"><table><thead><tr><th>Имя</th><th>Email</th><th>Роль</th><th>Заказов</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{{client:'Клиент',manager:'Менеджер',owner:'Владелец'}[u.role]}</td><td>{orders.filter(o=>o.userId===u.id).length}</td></tr>)}</tbody></table></div>}

const MON=['Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт'],RENT=[12,18,15,24,30,28,35,42],SALE=[4,6,5,9,8,12,10,15]
function Analytics(){const {items,orders,resetData}=useApp()
 const act=orders.filter(o=>o.status!=='cancelled'),pr=o=>items.find(i=>i.id===o.itemId)
 const rentSum=act.filter(o=>o.type==='rent').reduce((s,o)=>s+days(o.from,o.to)*pr(o).rent,0),saleSum=act.filter(o=>o.type==='sale').reduce((s,o)=>s+pr(o).sale,0)
 const pop=items.map(i=>[i,orders.filter(o=>o.itemId===i.id).length]).sort((a,b)=>b[1]-a[1]).slice(0,4)
 const stats=[['Всего заказов',orders.length],['Платьев в аренде',items.filter(i=>i.status==='rented').length],['Выручка (аренда)',money(rentSum)],['Выручка (продажи)',money(saleSum)],['Предоплат получено',money(act.filter(o=>o.paid).reduce((s,o)=>s+(o.prepay||0),0))]]
 const line=(a,c)=><polyline fill="none" stroke={c} strokeWidth="2.5" points={a.map((v,i)=>`${25+i*50},${140-v*3}`).join(' ')}/>
 return <><div className="stats">{stats.map(([l,v])=><div className="box" key={l}><small>{l}</small><b>{v}</b></div>)}</div>
 <div className="two"><div className="box"><h3>Динамика заказов</h3><svg viewBox="0 0 400 165" className="chart" role="img" aria-label="График заказов">{[20,50,80,110,140].map(y=><line key={y} x1="10" x2="390" y1={y} y2={y} stroke="#E5DCD0"/>)}{line(RENT,'#A97593')}{line(SALE,'#B8935A')}{MON.map((m,i)=><text key={m} x={25+i*50} y="160" fontSize="11" textAnchor="middle" fill="#6B7280">{m}</text>)}</svg>
  <small><span className="dot" style={{background:'#A97593'}}/>Аренда <span className="dot" style={{background:'#B8935A'}}/>Продажа (демо-данные)</small></div>
 <div className="box"><h3>Популярные платья</h3>{pop.map(([i,c])=><div className="thumbrow pop" key={i.id}><Photo shot={shots(i)[0]} item={i} v={i.id}/><span>{i.name}</span><b>{c} заказ.</b></div>)}</div></div><p className="muted">Данные сохраняются в браузере. <button className="btn sm out" onClick={()=>window.confirm('Сбросить все данные к начальным?')&&resetData()}>Сбросить демо-данные</button></p></>}

function ItemForm({edit,done}){const {addItem,updateItem}=useApp()
 const init=edit?{name:edit.name,size:edit.size,color:edit.color==='—'?'':edit.color,rent:edit.rent,sale:edit.sale,desc:edit.desc||'',status:edit.status}:{name:'',size:'S',color:'',rent:'',sale:'',desc:'',status:'available'}
 const [f,setF]=useState(init),[ph,setPh]=useState(edit?.photos||[]),[busy,setBusy]=useState(false),set=k=>e=>setF({...f,[k]:e.target.value})
 const pick=async e=>{setBusy(true);const add=await Promise.all([...e.target.files].map(readPhoto));setPh(p=>[...p,...add]);setBusy(false);e.target.value=''}
 const submit=e=>{e.preventDefault();const d={name:f.name,size:f.size,color:f.color||'—',rent:+f.rent,sale:+f.sale,desc:f.desc||undefined,photos:ph.length?ph:undefined,tone:ph[0]?.tone||edit?.tone||'#F1E4EE'}
  if(edit){updateItem(edit.id,{...d,status:f.status});done()}else{addItem(d);setF(init);setPh([])}}
 return <form className="box" onSubmit={submit}><h3>{edit?`Изменить платье «${edit.name}»`:'Добавить платье'}</h3>
  <label>Название<input required value={f.name} onChange={set('name')}/></label>
  <div className="two"><label>Размер<select value={f.size} onChange={set('size')}>{['S','M','L'].map(s=><option key={s}>{s}</option>)}</select></label><label>Цвет<input value={f.color} onChange={set('color')} placeholder="Например, Белый"/></label></div>
  <div className="two"><label>Аренда, ₸/день<input type="number" min="1" required value={f.rent} onChange={set('rent')}/></label><label>Цена продажи, ₸<input type="number" min="1" required value={f.sale} onChange={set('sale')}/></label></div>
  {edit&&<label>Статус<select value={f.status} onChange={set('status')}>{['available','booked','rented','sold','cleaning'].map(s=><option key={s} value={s}>{ST[s][0]}</option>)}</select></label>}
  <label>Описание (необязательно)<textarea value={f.desc} onChange={set('desc')}/></label>
  <label>Фото: первое — главное, остальные — другие ракурсы<input type="file" accept="image/*" multiple onChange={pick}/></label>
  {ph.length>0&&<><div className="prev">{ph.map((p,i)=><span key={i}><img src={p.src} alt="" title="Сделать главным" onClick={()=>setPh([p,...ph.filter((_,j)=>j!==i)])}/>{i===0&&<em>главное</em>}<button type="button" onClick={()=>setPh(ph.filter((_,j)=>j!==i))} aria-label="Убрать фото">×</button></span>)}</div><small>Нажмите на фото, чтобы сделать его главным</small></>}
  <button className="btn full" disabled={busy}>{edit?'Сохранить изменения':'Добавить платье'}</button>{edit&&<button type="button" className="btn out full" onClick={done}>Отмена</button>}</form>}
function Dresses(){const {items}=useApp(),[ed,setEd]=useState(null),cur=ed&&items.find(x=>x.id===ed.id)
 return <><ItemsTable onEdit={i=>{setEd(i);setTimeout(()=>document.getElementById('dress-form')?.scrollIntoView({behavior:'smooth'}),60)}}/><div id="dress-form"><ItemForm key={cur?.id||'new'} edit={cur} done={()=>setEd(null)}/></div></>}

const parseCode=t=>decodeURIComponent((t||'').trim().split('/').pop()).toUpperCase()
// Сканер: камера читает QR на бирке, открывается карточка платья /scan/KU-001
function Scanner(){const nav=useNavigate(),[err,setErr]=useState(''),[code,setCode]=useState('')
 useEffect(()=>{let sc,live=true,done=false
  import('html5-qrcode').then(({Html5Qrcode})=>{if(!live)return;sc=new Html5Qrcode('qr-reader')
   sc.start({facingMode:'environment'},{fps:10,qrbox:{width:240,height:240}},txt=>{if(done)return;done=true;nav('/scan/'+parseCode(txt))},()=>{}).catch(()=>setErr('Камера недоступна. Разрешите доступ к камере (нужен HTTPS или localhost) или введите код вручную.'))})
  return()=>{live=false;try{sc&&sc.stop().then(()=>sc.clear()).catch(()=>{})}catch{}}},[])
 return <div className="box"><h3>Сканер QR</h3><div id="qr-reader" className="qr-reader"/>{err&&<div className="err">{err}</div>}
  <form onSubmit={e=>{e.preventDefault();code&&nav('/scan/'+parseCode(code))}}><label>Или введите код вручную<input placeholder="KU-001" value={code} onChange={e=>setCode(e.target.value)}/></label><button className="btn full">Найти платье</button></form></div>}
function QRSheet(){const {items}=useApp(),base=window.location.origin
 return <><div className="row no-print"><p className="muted">Распечатайте бирки и прикрепите к платьям. Сотрудник сканирует бирку и меняет статус.{base.includes('localhost')?' Сейчас QR ведёт на адрес вашего компьютера — для печати выложите сайт в интернет.':''}</p><button className="btn sm" onClick={()=>window.print()}>Печать</button></div>
 <div className="qrs">{items.map(i=><figure key={i.id}><QRCodeSVG value={`${base}/scan/${codeOf(i)}`} size={132} level="M" includeMargin/><figcaption><b>{i.name}</b><br/>{codeOf(i)}</figcaption></figure>)}</div></>}
export function ScanResult(){const {code}=useParams(),{items,user,setItemStatus}=useApp(),loc=useLocation()
 const c=parseCode(code),item=items.find(i=>codeOf(i)===c),staff=user&&user.role!=='client',back=user?.role==='owner'?'/admin?tab=s':'/manager?tab=s'
 if(!item)return <div className="wrap sec scan"><div className="box"><h2>Платье не найдено</h2><p>Код {c} не найден.</p>{staff&&<Link className="btn" to={back}>Сканировать снова</Link>}</div></div>
 const nx=NEXT[item.status]
 return <div className="wrap sec scan"><div className="box"><div className="mini"><Photo shot={shots(item)[0]} item={item}/><div><h2>{item.name}</h2><small>{c}</small><br/><StatusBadge s={item.status}/></div></div>
  {staff?<>{nx&&<button className="btn full" onClick={()=>setItemStatus(item.id,nx)}>Статус → {ST[nx][0]}</button>}
   <label>Другой статус<select value={item.status} onChange={e=>setItemStatus(item.id,e.target.value)}>{['available','booked','rented','sold','cleaning'].map(s=><option key={s} value={s}>{ST[s][0]}</option>)}</select></label>
   <Link className="btn out full" to={back}>Сканировать следующее</Link></>
  :<><p className="muted">Менять статус могут только сотрудники салона.</p><Link className="btn full" to={'/catalog/'+item.id}>Открыть страницу платья</Link>{!user&&<Link className="btn out full" to="/login" state={{from:loc.pathname}}>Войти как сотрудник</Link>}</>}</div></div>}

function Dash({title,tabs}){const [q]=useSearchParams(),[t,setT]=useState(tabs.some(x=>x[0]===q.get('tab'))?q.get('tab'):tabs[0][0]),{user}=useApp()
 return <div className="dash"><aside>{tabs.map(([k,l])=><button key={k} className={k===t?'on':''} onClick={()=>setT(k)}>{l}</button>)}</aside>
 <section><div className="row"><h1>{title}</h1><span className="hi"><Icon n="user"/>{user.name}</span></div>{tabs.find(x=>x[0]===t)[2]}</section></div>}
export const Manager=()=><Dash title="Панель менеджера" tabs={[['o','Заказы',<Orders/>],['i','Платья',<Dresses/>],['s','Сканер',<Scanner/>],['q','QR-бирки',<QRSheet/>],['c','Клиенты',<Clients/>]]}/>
export const Admin=()=><Dash title="Панель владельца" tabs={[['a','Аналитика',<Analytics/>],['i','Платья',<Dresses/>],['o','Заказы',<Orders/>],['s','Сканер',<Scanner/>],['q','QR-бирки',<QRSheet/>],['c','Клиенты',<Clients/>]]}/>

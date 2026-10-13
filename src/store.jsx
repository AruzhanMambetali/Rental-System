import {createContext,useContext,useState,useEffect} from 'react'
import {items0,orders0,users0} from './data.js'
const Ctx=createContext();export const useApp=()=>useContext(Ctx)
export const ST={available:['В наличии','green'],booked:['Забронировано','gold'],rented:['В аренде','blue'],sold:['Продано','blue'],cleaning:['На чистке','gray'],pending:['Ожидает','gold'],confirmed:['Подтверждена','green'],cancelled:['Отменена','gray']}
export const NEXT={available:'booked',booked:'rented',rented:'cleaning',cleaning:'available'}
export const CLEAN=2,PREPAY=0.3 // дни на чистку между арендами; доля предоплаты
export const codeOf=i=>'KU-'+i.article
export const money=n=>n.toLocaleString('ru-RU')+' ₸'
export const iso=d=>d.toISOString().slice(0,10)
export const add=(s,n)=>{const d=new Date(s);d.setUTCDate(d.getUTCDate()+n);return iso(d)}
export const days=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5)+1
const KEY='ku1:'
// данные сохраняются в браузере (localStorage)
function usePersist(k,init){const [v,setV]=useState(()=>{try{const s=localStorage.getItem(KEY+k);return s?JSON.parse(s):init}catch{return init}})
 useEffect(()=>{try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch{}},[k,v]);return[v,setV]}
export function AppProvider({children}){
 const [items,setItems]=usePersist('items',items0),[orders,setOrders]=usePersist('orders',orders0),[users,setUsers]=usePersist('users',users0),[user,setUser]=usePersist('user',null),[favs,setFavs]=usePersist('favs',[]),[lang,setLang]=usePersist('lang','ru')
 const live=orders.filter(o=>o.type==='rent'&&o.status!=='cancelled')
 // конфликт дат с учётом дней на чистку до и после чужой аренды
 const conflict=(id,a,b)=>live.some(o=>o.itemId===id&&a<=add(o.to,CLEAN)&&add(b,CLEAN)>=o.from)
 const dayState=(id,k)=>{let s=null;for(const o of live){if(o.itemId!==id)continue;if(k>=o.from&&k<=o.to)return'busy';if(k>=add(o.from,-CLEAN)&&k<=add(o.to,CLEAN))s='clean'}return s}
 const nearest=(id,from,n)=>{const r=[],t=iso(new Date());for(let i=-30;i<120&&r.length<2;i++){const a=add(from,i),b=add(a,n-1);if(a>=t&&!conflict(id,a,b)){r.push([a,b]);i+=n}}return r}
 const setItemStatus=(id,status)=>setItems(l=>l.map(x=>x.id===id?{...x,status}:x))
 const placeOrder=o=>{
  if(o.type==='rent'&&conflict(o.itemId,o.from,o.to))return{ok:false,slots:nearest(o.itemId,o.from,days(o.from,o.to))}
  setOrders(l=>[...l,{...o,id:Math.max(0,...l.map(x=>x.id))+1,userId:user.id,status:'pending',prepay:Math.round(o.total*PREPAY),paid:false}]);setItemStatus(o.itemId,'booked');return{ok:true}}
 const setOrderStatus=(id,status)=>{const o=orders.find(x=>x.id===id);setOrders(l=>l.map(x=>x.id===id?{...x,status}:x));if(status==='confirmed'&&o.type==='sale')setItemStatus(o.itemId,'sold')}
 const markPaid=id=>setOrders(l=>l.map(x=>x.id===id?{...x,paid:true}:x))
 const addItem=f=>setItems(l=>{const id=Math.max(0,...l.map(x=>x.id))+1;return[...l,{id,article:String(id).padStart(3,'0'),status:'available',...f}]})
 const updateItem=(id,f)=>setItems(l=>l.map(x=>x.id===id?{...x,...f}:x))
 const deleteItem=id=>{setItems(l=>l.filter(x=>x.id!==id));setOrders(l=>l.filter(o=>o.itemId!==id));setFavs(f=>f.filter(x=>x!==id))}
 const safe=({password,...u})=>u
 const login=(email,password)=>{const u=users.find(x=>x.email===email&&x.password===password);setUser(u?safe(u):null);return !!u}
 const register=(name,email,password)=>{if(users.some(x=>x.email===email))return false;const u={id:Math.max(0,...users.map(x=>x.id))+1,name,email,password,role:'client'};setUsers([...users,u]);setUser(safe(u));return true}
 const resetData=()=>{Object.keys(localStorage).filter(k=>k.startsWith(KEY)).forEach(k=>localStorage.removeItem(k));location.reload()}
 return <Ctx.Provider value={{lang,setLang,dayState,markPaid,resetData,updateItem,deleteItem,favs,toggleFav:id=>setFavs(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]),items,orders,users,user,conflict,nearest,placeOrder,setOrderStatus,setItemStatus,addItem,login,register,logout:()=>setUser(null)}}>{children}</Ctx.Provider>}

// Загрузка фото в браузере: уменьшает снимок и подбирает мягкий цвет фона по его средним цветам
export const readPhoto=file=>new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
 const k=Math.min(1,1100/im.height),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height)
 const s=document.createElement('canvas');s.width=s.height=8;const y=s.getContext('2d');y.drawImage(im,0,0,8,8);const d=y.getImageData(0,0,8,8).data;let R=0,G=0,B=0;for(let i=0;i<d.length;i+=4){R+=d[i];G+=d[i+1];B+=d[i+2]}
 const n=d.length/4,m=v=>Math.round(255-(255-v/n)*.3);res({src:c.toDataURL('image/jpeg',.82),tone:`rgb(${m(R)},${m(G)},${m(B)})`})};im.src=r.result};r.readAsDataURL(file)})

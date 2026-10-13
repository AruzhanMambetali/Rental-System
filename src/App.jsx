import {Routes,Route} from 'react-router-dom'
import {Layout,Protected} from './components.jsx'
import {Home,Catalog,ItemPage,Checkout,MyOrders,Auth,Manager,Admin,ScanResult} from './pages.jsx'
export default function App(){return(<Layout><Routes>
<Route path="/" element={<Home/>}/><Route path="/catalog" element={<Catalog/>}/><Route path="/catalog/:id" element={<ItemPage/>}/>
<Route path="/scan/:code" element={<ScanResult/>}/>
<Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth register/>}/>
<Route path="/checkout/:id" element={<Protected><Checkout/></Protected>}/>
<Route path="/my-orders" element={<Protected><MyOrders/></Protected>}/>
<Route path="/manager" element={<Protected roles={['manager','owner']}><Manager/></Protected>}/>
<Route path="/admin" element={<Protected roles={['owner']}><Admin/></Protected>}/>
<Route path="*" element={<p className="wrap sec">Страница не найдена</p>}/>
</Routes></Layout>)}

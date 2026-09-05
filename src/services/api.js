const API_URL=import.meta.env.VITE_ADMIN_API_URL||import.meta.env.VITE_API_URL||'http://localhost:8080/api'
async function request(path,options={}){const res=await fetch(`${API_URL}${path}`,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});if(!res.ok){let message=`API ${res.status}`;try{const body=await res.json();message=body.message||message}catch{}throw new Error(message)}return res.status===204?null:res.json()}
export const api={
 dashboard:()=>request('/admin/dashboard/summary'),
 products:(params='')=>request(`/admin/products${params}`), product:id=>request(`/admin/products/${id}`), saveProduct:(body,id)=>request(`/admin/products${id?`/${id}`:''}`,{method:id?'PATCH':'POST',body:JSON.stringify(body)}),
 categories:()=>request('/admin/categories'),createCategory:body=>request('/admin/categories',{method:'POST',body:JSON.stringify(body)}),updateCategory:(id,body)=>request(`/admin/categories/${id}`,{method:'PATCH',body:JSON.stringify(body)}),deleteCategory:id=>request(`/admin/categories/${id}`,{method:'DELETE'}),
 inventory:()=>request('/admin/inventory'),adjustInventory:(id,body)=>request(`/admin/inventory/${id}`,{method:'PATCH',body:JSON.stringify(body)}),orders:()=>request('/admin/orders'),order:id=>request(`/admin/orders/${id}`),customers:()=>request('/admin/customers'),customer:id=>request(`/admin/customers/${id}`),analytics:()=>request('/admin/analytics'),settings:()=>request('/admin/settings'),saveSettings:body=>request('/admin/settings',{method:'PATCH',body:JSON.stringify(body)}),roles:()=>request('/admin/roles')
}

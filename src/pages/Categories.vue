<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'

const categories = ref([])
const form = ref({ id: null, name: '', slug: '', image_url: '', parent_id: null, active: true })
const loading = ref(true); const saving = ref(false); const error = ref('')

const fallback = [
  {id:1,name:'أثاث خارجي',slug:'outdoor-furniture',active:true,image_url:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=180&q=80'},
  {id:2,name:'كراسي',slug:'chairs',active:true,image_url:'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=180&q=80'},
  {id:3,name:'إضاءة',slug:'lighting',active:true,image_url:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=180&q=80'}
]
async function load(){ loading.value=true; try{const r=await api.categories(); categories.value=r?.data||r||[]}catch{categories.value=fallback}finally{loading.value=false} }
function edit(c){form.value={id:c.id,name:c.name,slug:c.slug,image_url:c.image_url||'',parent_id:c.parent_id||null,active:c.active!==false}}
function reset(){form.value={id:null,name:'',slug:'',image_url:'',parent_id:null,active:true};error.value=''}
async function save(){ error.value=''; if(!form.value.name||!form.value.slug){error.value='اسم القسم والرابط مطلوبان';return} saving.value=true; try{ if(form.value.id) await api.updateCategory(form.value.id,form.value); else await api.createCategory(form.value); await load(); reset()}catch(e){error.value=e.message||'تعذر حفظ القسم'}finally{saving.value=false} }
async function remove(c){if(!confirm(`حذف القسم ${c.name}؟`))return;try{await api.deleteCategory(c.id);await load()}catch(e){error.value=e.message||'تعذر حذف القسم'}}
onMounted(load)
</script>
<template><div><div class="page-head"><div><span class="eyebrow">CATALOG</span><h1>Categories</h1><p>أنشئ الأقسام التي تظهر في الصفحة الرئيسية وقائمة المتجر، واستخدمها عند إنشاء المنتجات.</p></div></div><div class="category-admin-grid"><section class="panel form-panel"><div class="panel-head"><h2>{{form.id?'Edit Category':'Add Category'}}</h2><button v-if="form.id" class="text-link" @click="reset">Cancel</button></div><div v-if="error" class="error-banner">{{error}}</div><div class="form-grid"><label>Category Name *<input v-model="form.name" placeholder="مثال: أثاث خارجي"></label><label>Slug *<input v-model="form.slug" placeholder="outdoor-furniture"></label><label>Image URL<input v-model="form.image_url" placeholder="https://..."></label><label>Parent Category<select v-model="form.parent_id"><option :value="null">Top level</option><option v-for="c in categories.filter(x=>x.id!==form.id)" :key="c.id" :value="c.id">{{c.name}}</option></select></label><label class="toggle-field"><input v-model="form.active" type="checkbox"> Active</label></div><button class="button button-blue" :disabled="saving" @click="save">{{saving?'Saving...':'Save Category'}}</button></section><section class="panel table"><div class="table-row header"><span>CATEGORY</span><span>SLUG</span><span>STATUS</span><span>PRODUCTS</span><span></span></div><div v-if="loading" class="empty-row">Loading categories...</div><div v-for="c in categories" :key="c.id" class="table-row"><span class="category-cell"><img :src="c.image_url" :alt="c.name"><b>{{c.name}}</b></span><span>{{c.slug}}</span><span><em :class="['status',c.active?'published':'draft']"><i></i>{{c.active?'ACTIVE':'INACTIVE'}}</em></span><span>{{c.product_count||0}}</span><span class="row-actions"><button class="text-link" @click="edit(c)">Edit</button><button class="text-link danger" @click="remove(c)">Delete</button></span></div></section></div></div></template>

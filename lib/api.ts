export interface Category {
  categoryId: string;
  slug: string;
  name: string;
  products?: any[];
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

function getAuthHeaders(isFormData = false): Record<string, string> {
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('lpsp_admin_token') || '';
  }
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(data: CreateCategoryDto): Promise<Category> {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function deleteCategory(slug: string): Promise<void> {
  const res = await fetch(`${API_URL}/categories/${slug}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

export interface ProductImage {
  imageId: string;
  secureUrl: string;
}

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  gramos_pieza: number;
  horas_impresion: number;
  minutos_impresion: number;
  segundos_impresion: number;
  ancho?: number;
  alto?: number;
  profundidad?: number;
  images?: ProductImage[];
  categoryId: string;
  category?: Category;
}

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  hasMore: boolean;
}

export interface GetProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categories?: string[];
  sort?: string;
  search?: string;
}

export async function getProducts(params?: GetProductsParams): Promise<GetProductsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.categories && params.categories.length > 0) {
    queryParams.append('categories', params.categories.join(','));
  }
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const url = `${API_URL}/products${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  const json = await res.json();
  
  if (json && json.data && json.meta) {
    return json;
  }
  
  return {
    data: Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []),
    meta: {
      totalItems: Array.isArray(json) ? json.length : 0,
      currentPage: 1,
      itemsPerPage: 100,
      hasMore: false,
    }
  };
}

export async function createProduct(formData: FormData): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ? JSON.stringify(err.message) : 'Failed to create product');
  }
  return res.json();
}

export async function updateProduct(productId: string, formData: FormData): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ? JSON.stringify(err.message) : 'Failed to update product');
  }
  return res.json();
}

export async function deleteProduct(productId: string): Promise<void> {
  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export interface CalculatePieceDto {
  pesoBobinaGramos: number;
  precioBobina: number;
  gramosPieza: number;
  horasImpresion: number;
  minutosImpresion: number;
  segundosImpresion: number;
  potenciaImpresoraKw: number;
  costoImpresora: number;
  horasDiseno: number;
  horasPostprocesado: number;
  porcentajeDesperdicioFallas: number;
  minutosPreparacionSlicer: number;
  costoPackagingFijo: number;
  porcentajeMargen: number;
  porcentajeComisionPlataforma: number;
}

export interface CalculatePieceResponse {
  resumenFinanciero: {
    precioSugeridoVenta: number;
    costoInternoTotal: number;
    gananciaNetaEstimada: number;
    montoComisionPlataforma: number;
  };
  desgloseDetallado: {
    materialConDesperdicio: number;
    infraestructuraYFallas: number;
    manoObraYPreparacion: number;
    packagingFijo: number;
    horasImpresionDecimalesControl: number;
  };
}

export async function calculateFinalPrice(dto: CalculatePieceDto): Promise<CalculatePieceResponse> {
  const res = await fetch(`${API_URL}/calculator/calculate-final-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to calculate price');
  }
  return res.json();
}

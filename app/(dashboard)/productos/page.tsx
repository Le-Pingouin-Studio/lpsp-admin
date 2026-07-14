"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, Search, Filter, Edit, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getCategories, createProduct, deleteProduct, updateProduct, Product } from "@/lib/api";

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('Relevancia');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery.length === 0) {
        setDebouncedSearch(searchQuery);
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setEditingProduct(null);
      reset({
        name: '', description: '', price: '', stock: '',
        gramos_pieza: '', horas_impresion: '', minutos_impresion: '',
        segundos_impresion: '', categoryId: '', ancho: '', alto: '', profundidad: ''
      });
      setSelectedFiles([]);
      setExistingImages([]);
    }, 200);
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      gramos_pieza: '',
      horas_impresion: '',
      minutos_impresion: '',
      segundos_impresion: '',
      categoryId: '',
      ancho: '',
      alto: '',
      profundidad: ''
    }
  });

  const queryClient = useQueryClient();

  const { data: productsData = { data: [], meta: { totalItems: 0, currentPage: 1, itemsPerPage: 10, hasMore: false } }, isLoading } = useQuery({
    queryKey: ['products', page, limit, selectedCategory, sortOption, debouncedSearch],
    queryFn: () => getProducts({
      page,
      limit,
      categories: selectedCategory !== 'all' ? [selectedCategory] : [],
      sort: sortOption,
      search: debouncedSearch
    }),
  });

  const products = productsData.data;
  const meta = productsData.meta;

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      alert(`Error al crear: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, formData }: { productId: string; formData: FormData }) => updateProduct(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      alert(`Error al actualizar: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(Number(data.price)));
    formData.append("stock", String(Number(data.stock)));
    formData.append("gramos_pieza", String(Number(data.gramos_pieza)));
    formData.append("horas_impresion", String(Number(data.horas_impresion)));
    formData.append("minutos_impresion", String(Number(data.minutos_impresion)));
    formData.append("segundos_impresion", String(Number(data.segundos_impresion)));
    formData.append("categoryId", data.categoryId);
    if (data.ancho) formData.append("ancho", String(Number(data.ancho)));
    if (data.alto) formData.append("alto", String(Number(data.alto)));
    if (data.profundidad) formData.append("profundidad", String(Number(data.profundidad)));

    selectedFiles.forEach(file => {
      formData.append("images", file);
    });

    if (editingProduct) {
      formData.append("imagesToKeep", JSON.stringify(existingImages.map(img => img.imageId)));
      updateMutation.mutate({ productId: editingProduct.productId, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages(prev => prev.filter(img => img.imageId !== imageId));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Catálogo de Productos</h1>
        <p className="text-muted-foreground mt-1">Gestione su inventario de impresión 3D, especificaciones técnicas y disponibilidad.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Activos Totales</div>
            <div className="text-3xl font-bold">{products.length}</div>
            <div className="w-full bg-muted h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[80%] rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Categorías</div>
            <div className="text-3xl font-bold">{categories.length}</div>
            <div className="text-sm font-medium text-sidebar-primary mt-1 flex items-center">
              Clasificaciones activas
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="pt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Sin Stock</div>
            <div className="text-3xl font-bold text-destructive">
              {products.filter(p => p.stock === 0).length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Requiere reposición</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Prom. Tiempo Imp.</div>
            <div className="text-3xl font-bold">
              {products.length > 0
                ? `${Math.round(products.reduce((acc, p) => acc + p.horas_impresion, 0) / products.length)}h`
                : '0h'}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Basado en catálogo</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar catálogo..." 
                className="pl-9 w-[250px]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val as string); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c.categoryId} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOption} onValueChange={(val) => { setSortOption(val as string); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Relevancia">Relevancia</SelectItem>
                <SelectItem value="Menor Precio">Menor Precio</SelectItem>
                <SelectItem value="Mayor Precio">Mayor Precio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) handleCloseDialog();
            else setIsDialogOpen(true);
          }}>
            <DialogTrigger render={<Button className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 gap-2" />}>
              <Plus className="h-4 w-4" /> Agregar nuevo producto
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
                <DialogDescription>
                  {editingProduct 
                    ? "Modifique los detalles del producto seleccionado." 
                    : "Complete los detalles del producto para agregarlo al catálogo."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Nombre del Producto</Label>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input {...field} placeholder="Ej. Soporte VESA..." />}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Descripción</Label>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input {...field} placeholder="Descripción del producto" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio ($)</Label>
                    <Controller
                      name="price"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input type="number" step="0.01" {...field} placeholder="0.00" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Controller
                      name="stock"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input type="number" {...field} placeholder="0" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Controller
                      name="categoryId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Seleccione una categoría</option>
                          {categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gramos (Peso)</Label>
                    <Controller
                      name="gramos_pieza"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input type="number" {...field} placeholder="50" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas Impresión</Label>
                    <Controller
                      name="horas_impresion"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input type="number" {...field} placeholder="2" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minutos Impresión</Label>
                    <Controller
                      name="minutos_impresion"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input type="number" {...field} placeholder="30" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Segundos Impresión</Label>
                    <Controller
                      name="segundos_impresion"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input type="number" {...field} placeholder="0" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ancho (cm)</Label>
                    <Controller
                      name="ancho"
                      control={control}
                      render={({ field }) => <Input type="number" step="0.1" {...field} placeholder="10.5" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alto (cm)</Label>
                    <Controller
                      name="alto"
                      control={control}
                      render={({ field }) => <Input type="number" step="0.1" {...field} placeholder="15.0" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profundidad (cm)</Label>
                    <Controller
                      name="profundidad"
                      control={control}
                      render={({ field }) => <Input type="number" step="0.1" {...field} placeholder="5.2" />}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Imágenes del Producto</Label>
                    <Input type="file" multiple accept="image/*" className="cursor-pointer" onChange={handleFileChange} />
                    <p className="text-xs text-muted-foreground">Las imágenes se subirán a Cloudinary.</p>
                    {(existingImages.length > 0 || selectedFiles.length > 0) && (
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {existingImages.map((img) => (
                          <div key={img.imageId} className="relative group rounded-md overflow-hidden border aspect-square">
                            <img src={img.secureUrl || img.secure_url} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(img.imageId)}
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group rounded-md overflow-hidden border aspect-square">
                            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(index)}
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Guardando..." : (editingProduct ? "Actualizar Producto" : "Guardar Producto")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <div className="border-t">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-bold uppercase w-[300px]">Producto</TableHead>
                <TableHead className="text-xs font-bold uppercase">Categoría</TableHead>
                <TableHead className="text-xs font-bold uppercase">Tiempo</TableHead>
                <TableHead className="text-xs font-bold uppercase">Precio Unit.</TableHead>
                <TableHead className="text-xs font-bold uppercase">Estado</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Cargando productos...</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay productos registrados.</TableCell>
                </TableRow>
              ) : products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-md border flex items-center justify-center overflow-hidden shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].secureUrl || (product.images[0] as any).secure_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">Img</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{product.gramos_pieza}g</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.category?.name || "Sin categoría"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 whitespace-nowrap">
                      {product.horas_impresion}h {product.minutos_impresion}m
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? "outline" : "destructive"} className={product.stock > 0 ? "bg-muted border-none" : ""}>
                      {product.stock > 0 ? `EN STOCK (${product.stock})` : "SIN STOCK"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingProduct(product);
                          setExistingImages(product.images || []);
                          reset({
                            name: product.name,
                            description: product.description,
                            price: String(product.price),
                            stock: String(product.stock),
                            gramos_pieza: String(product.gramos_pieza),
                            horas_impresion: String(product.horas_impresion),
                            minutos_impresion: String(product.minutos_impresion),
                            segundos_impresion: String(product.segundos_impresion),
                            categoryId: product.categoryId || (product.category ? product.category.categoryId : ''),
                            ancho: product.ancho ? String(product.ancho) : '',
                            alto: product.alto ? String(product.alto) : '',
                            profundidad: product.profundidad ? String(product.profundidad) : ''
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`¿Estás seguro de que quieres eliminar ${product.name}?`)) {
                            deleteMutation.mutate(product.productId);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginación */}
        {!isLoading && products.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Mostrando {((meta.currentPage - 1) * meta.itemsPerPage) + 1} - {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} de {meta.totalItems} productos
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={meta.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <div className="text-sm font-medium">
                Página {meta.currentPage} de {Math.max(1, Math.ceil(meta.totalItems / meta.itemsPerPage))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={!meta.hasMore}
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

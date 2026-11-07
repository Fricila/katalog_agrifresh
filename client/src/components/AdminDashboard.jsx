import React, { useState, useEffect, useMemo } from 'react';
import {
    Package,
    Layers,
    Settings,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    PhoneCall,
    Save,
    AlertCircle,
    Check,
    Store,
    LogOut,
    ShoppingBag,
    Database,
    Menu,
    X,
    ExternalLink,
    ChevronRight,
    ShieldCheck,
    RefreshCw
} from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmModal } from './ConfirmModal';
import { ProfileModal } from './ProfileModal';
import {
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    toggleProductStock,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
    updateStoreSettings,
    fetchAdminProfile,
    updateAdminProfile
} from '../services/api';

// Fallback seed data in case API or parent state is not yet populated
const DEFAULT_PRODUCTS = [
    {
        id: 'prod-1',
        name: 'Pakcoy Premium',
        categoryId: 'cat-1',
        categoryName: 'Sayuran',
        price: 12000,
        stockStatus: 'Tersedia',
        description: 'Pakcoy hidroponik segar, dipetik langsung dari kebun pagi hari. Renyah dan kaya nutrisi.',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        unit: 'ikat'
    },
    {
        id: 'prod-wortel',
        name: 'Wortel Segar',
        categoryId: 'cat-1',
        categoryName: 'Sayuran',
        price: 15000,
        stockStatus: 'Tersedia',
        description: 'Wortel manis segar organik pilihan, kaya akan vitamin A dan beta karoten alami.',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=600&q=80',
        unit: 'kg'
    },
    {
        id: 'prod-apel',
        name: 'Apel Fuji',
        categoryId: 'cat-2',
        categoryName: 'Buah',
        price: 38000,
        stockStatus: 'Tersedia',
        description: 'Apel Fuji manis, renyah dan berair banyak. Pilihan favorit keluarga untuk hidup sehat.',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
        unit: 'kg'
    },
    {
        id: 'prod-2',
        name: 'Mangga Harumanis',
        categoryId: 'cat-2',
        categoryName: 'Buah',
        price: 32000,
        stockStatus: 'Tersedia',
        description: 'Mangga Harumanis matang pohon dengan aroma harum semerbak dan rasa manis legit alami.',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
        unit: 'kg'
    },
    {
        id: 'proud-3',
        name: 'Tomat Merah',
        categoryId: 'cat-1',
        categoryName: 'Sayuran',
        price: 10000,
        stockStatus: 'Tersedia',
        description: 'Tomat merah segar padat berisi, cocok untuk jus sehat, salad, dan masakan harian.',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        unit: 'kg'
    },
    {
        id: 'prod-anggur',
        name: 'Anggur Red Globe',
        categoryId: 'cat-2',
        categoryName: 'Buah',
        price: 48000,
        stockStatus: 'Tersedia',
        description: 'Anggur merah manis berdaging tebal dan renyah. Sangat segar untuk santapan keluarga.',
        image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
        unit: 'kg'
    },
    {
        id: 'proud-4',
        name: 'Jeruk Manis',
        categoryId: 'cat-2',
        categoryName: 'Buah',
        price: 24000,
        stockStatus: 'Tersedia',
        description: 'Jeruk segar pilihan dengan rasa manis segar berlimpah vitamin C.',
        image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
        unit: 'kg'
    },
    {
        id: 'proud-5',
        name: 'Pisang Cavendish',
        categoryId: 'cat-2',
        categoryName: 'Buah',
        price: 18000,
        stockStatus: 'Tersedia',
        description: 'Pisang Cavendish kulit mulus kuning keemasan, manis alami dan lembut.',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
        unit: 'sisir'
    },
    {
        id: 'prod-salad-buah',
        name: 'Salad Buah Segar',
        categoryId: 'cat-3',
        categoryName: 'Salad Buah',
        price: 25000,
        stockStatus: 'Tersedia',
        description: 'Kombinasi melon, apel, anggur, dan nata de coco dengan saus dressing yogurt segar dan taburan keju.',
        image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80',
        unit: 'bowl'
    },
    {
        id: 'prod-salad-sayur',
        name: 'Salad Sayur Organik',
        categoryId: 'cat-4',
        categoryName: 'Salad Sayur',
        price: 22000,
        stockStatus: 'Tersedia',
        description: 'Campuran selada romaine, wortel serut, kubis ungu, dan tomat ceri dengan dressing wijen sangrai gurih.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        unit: 'bowl'
    }
];

const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'Sayuran', slug: 'sayuran', productCount: 3 },
    { id: 'cat-2', name: 'Buah', slug: 'buah', productCount: 5 },
    { id: 'cat-3', name: 'Salad Buah', slug: 'salad-buah', productCount: 1 },
    { id: 'cat-4', name: 'Salad Sayur', slug: 'salad-sayur', productCount: 1 }
];

export const AdminDashboard = ({
    products = [],
    categories = [],
    storeSettings = {},
    adminUser = null,
    onRefreshData = null,
    onBackToCatalog = () => { },
    onLogout = () => { }
}) => {
    const [activeTab, setActiveTab] = useState('products'); // 'products' | 'categories' | 'settings'
    const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

    // Internal state for self-fetching and resilient display
    const [currentProducts, setCurrentProducts] = useState(() => {
        if (Array.isArray(products) && products.length > 0) return products;
        if (Array.isArray(products?.data) && products.data.length > 0) return products.data;
        return [];
    });
    const [currentCategories, setCurrentCategories] = useState(() => {
        if (Array.isArray(categories) && categories.length > 0) return categories;
        if (Array.isArray(categories?.data) && categories.data.length > 0) return categories.data;
        return [];
    });
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Sync with incoming props if they arrive later
    useEffect(() => {
        const parsed = Array.isArray(products)
            ? products
            : Array.isArray(products?.data)
                ? products.data
                : [];
        if (parsed.length > 0) {
            setCurrentProducts(parsed);
        }
    }, [products]);

    useEffect(() => {
        const parsed = Array.isArray(categories)
            ? categories
            : Array.isArray(categories?.data)
                ? categories.data
                : [];
        if (parsed.length > 0) {
            setCurrentCategories(parsed);
        }
    }, [categories]);

    // Self-fetch if initial products are empty
    const fetchDataFromApi = async () => {
        setIsLoadingData(true);
        try {
            if (typeof onRefreshData === 'function') {
                await onRefreshData();
            }
            const [prodRes, catRes] = await Promise.allSettled([
                fetchProducts(),
                fetchCategories()
            ]);

            if (prodRes.status === 'fulfilled' && prodRes.value) {
                const prodData = prodRes.value.data || prodRes.value;
                if (Array.isArray(prodData) && prodData.length > 0) {
                    setCurrentProducts(prodData);
                }
            }

            if (catRes.status === 'fulfilled' && catRes.value) {
                const catData = catRes.value.data || catRes.value;
                if (Array.isArray(catData) && catData.length > 0) {
                    setCurrentCategories(catData);
                }
            }
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        // Auto-fetch if no products provided via props
        if (!products || (Array.isArray(products) && products.length === 0)) {
            fetchDataFromApi();
        }
    }, []);

    // Product states
    const [productSearch, setProductSearch] = useState('');
    const [productCategoryFilter, setProductCategoryFilter] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);

    // Category states
    const [newCatName, setNewCatName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCatName, setEditCatName] = useState('');
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [catError, setCatError] = useState('');

    // Settings states
    const [settingsForm, setSettingsForm] = useState({
        storeName: storeSettings?.storeName || 'AgriFresh',
        tagline: storeSettings?.tagline || 'Pilihan Sayur & Buah Organik Segar Berkualitas',
        phone: storeSettings?.phone || '6285777435992',
        address: storeSettings?.address || 'Jl. Sukabumi Asri No. 45, Jawa Barat'
    });
    const [settingsSuccess, setSettingsSuccess] = useState(false);
  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', password: '' });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Load admin profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchAdminProfile();
        if (res && res.user) {
          setProfileForm({ name: res.user.name || '', email: res.user.email || '', password: '' });
        }
      } catch (err) {
        console.warn('Failed to load admin profile:', err.message);
      }
    };
    loadProfile();
  }, []);

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    const { name, email, password } = profileForm;
    if (!name.trim() || !email.trim()) {
      setProfileError('Nama dan email wajib diisi.');
      return;
    }
    try {
      await updateAdminProfile({ name: name.trim(), email: email.trim(), ...(password ? { password } : {}) });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.message || 'Gagal memperbarui profil.');
    }
  };

    useEffect(() => {
        if (storeSettings && Object.keys(storeSettings).length > 0) {
            setSettingsForm({
                storeName: storeSettings.storeName || 'AgriFresh',
                tagline: storeSettings.tagline || 'Pilihan Sayur & Buah Organik Segar Berkualitas',
                phone: storeSettings.phone || '6285777435992',
                address: storeSettings.address || 'Jl. Sukabumi Asri No. 45, Jawa Barat'
            });
        }
    }, [storeSettings]);

    // Active Category List with robust fallback
    const activeCategories = useMemo(() => {
        const source = (currentCategories && currentCategories.length > 0)
            ? currentCategories
            : (Array.isArray(categories) && categories.length > 0)
                ? categories
                : (Array.isArray(categories?.data) && categories.data.length > 0)
                    ? categories.data
                    : DEFAULT_CATEGORIES;

        return source.map((c, idx) => ({
            ...c,
            id: c.id || `cat-${idx + 1}`,
            name: c.name || c.title || `Kategori ${idx + 1}`
        }));
    }, [currentCategories, categories]);

    // Active Product List with robust normalization & fallback
    const activeProducts = useMemo(() => {
        const source = (currentProducts && currentProducts.length > 0)
            ? currentProducts
            : (Array.isArray(products) && products.length > 0)
                ? products
                : (Array.isArray(products?.data) && products.data.length > 0)
                    ? products.data
                    : DEFAULT_PRODUCTS;

        return source.map((p, idx) => {
            const catId = p.categoryId || p.category_id || p.category || '';
            const matchedCategory = activeCategories.find((c) => String(c.id) === String(catId));
            const catName = p.categoryName || p.category_name || (matchedCategory ? matchedCategory.name : 'Organik');

            return {
                ...p,
                id: p.id || p._id || `prod-auto-${idx}`,
                name: p.name || p.Name || p.title || 'Produk Segar',
                categoryId: catId,
                categoryName: catName,
                price: Number(p.price) || 0,
                stockStatus: p.stockStatus || p.stock_status || 'Tersedia',
                image: p.image || p.imageUrl || p.photo || '',
                unit: p.unit || 'kg',
                description: p.description || p.desc || ''
            };
        });
    }, [currentProducts, products, activeCategories]);

    // Currency Formatter
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(num) || 0);
    };

    // Filter products for admin table
    const filteredProducts = useMemo(() => {
        return activeProducts.filter((p) => {
            const matchesCat = !productCategoryFilter || String(p.categoryId) === String(productCategoryFilter);
            const searchLower = (productSearch || '').trim().toLowerCase();
            const matchesSearch = !searchLower ||
                p.name.toLowerCase().includes(searchLower) ||
                p.categoryName.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower);

            return matchesCat && matchesSearch;
        });
    }, [activeProducts, productCategoryFilter, productSearch]);

    // Stock counts
    const totalCount = activeProducts.length;
    const availableCount = activeProducts.filter((p) => p.stockStatus === 'Tersedia').length;
    const outCount = totalCount - availableCount;

    // --- Handlers: Product Management ---
    const handleOpenAddProduct = () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const handleOpenEditProduct = (prod) => {
        setEditingProduct(prod);
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async (payload, id) => {
        const isFormData = payload instanceof FormData;
        const formName = isFormData ? payload.get('name') : payload.name;
        const rawPrice = isFormData ? payload.get('price') : payload.price;
        const formPrice = rawPrice !== undefined && rawPrice !== null ? Number(rawPrice) : undefined;
        const formCategoryId = isFormData ? payload.get('categoryId') : payload.categoryId;
        const formUnit = isFormData ? payload.get('unit') : payload.unit;
        const formStockStatus = isFormData ? payload.get('stockStatus') : payload.stockStatus;
        const formDescription = isFormData ? payload.get('description') : payload.description;
        const formImage = isFormData ? (payload.get('imageUrl') || '') : (payload.imageUrl || '');

        let savedProduct = null;
        try {
            if (id) {
                const res = await updateProduct(id, payload);
                savedProduct = res?.data || res;
            } else {
                const res = await createProduct(payload);
                savedProduct = res?.data || res;
            }
        } catch (err) {
            console.warn('Gagal menyimpan produk ke server:', err.message);
        }

        const resolvedCatName = activeCategories.find((c) => String(c.id) === String(formCategoryId))?.name || 'Organik';

        // Optimistically update local state so products appear and update immediately
        if (id) {
            const finalImage = (savedProduct && savedProduct.image)
                ? savedProduct.image
                : (formImage || '');

            setCurrentProducts((prev) => {
                const list = prev && prev.length > 0 ? prev : activeProducts;
                return list.map((p) => {
                    if (p.id === id) {
                        return {
                            ...p,
                            ...(savedProduct || {}),
                            name: formName || savedProduct?.name || p.name,
                            price: formPrice !== undefined && !isNaN(formPrice) ? formPrice : (savedProduct?.price ?? p.price),
                            categoryId: formCategoryId || savedProduct?.categoryId || p.categoryId,
                            categoryName: resolvedCatName || savedProduct?.categoryName || p.categoryName,
                            unit: formUnit || savedProduct?.unit || p.unit,
                            stockStatus: formStockStatus || savedProduct?.stockStatus || p.stockStatus,
                            description: formDescription !== undefined ? formDescription : (savedProduct?.description ?? p.description),
                            image: finalImage || p.image
                        };
                    }
                    return p;
                });
            });
        } else {
            const finalImage = (savedProduct && savedProduct.image)
                ? savedProduct.image
                : (formImage || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');

            const newProd = {
                id: savedProduct?.id || `prod-${Date.now()}`,
                name: formName || savedProduct?.name || 'Produk Baru',
                categoryId: formCategoryId || savedProduct?.categoryId || (activeCategories[0]?.id || 'cat-1'),
                categoryName: resolvedCatName,
                price: formPrice !== undefined && !isNaN(formPrice) ? formPrice : (savedProduct?.price || 0),
                unit: formUnit || savedProduct?.unit || 'kg',
                stockStatus: formStockStatus || savedProduct?.stockStatus || 'Tersedia',
                description: formDescription || savedProduct?.description || '',
                image: finalImage,
                ...(savedProduct || {})
            };
            setCurrentProducts((prev) => [newProd, ...(prev && prev.length > 0 ? prev : activeProducts)]);
        }

        if (typeof onRefreshData === 'function') {
            try {
                await onRefreshData();
            } catch (_) { }
        }
    };

    const handleToggleStock = async (id) => {
        // Optimistic update
        setCurrentProducts((prev) => {
            const list = prev && prev.length > 0 ? prev : activeProducts;
            return list.map((p) => {
                if (p.id === id) {
                    const nextStatus = p.stockStatus === 'Tersedia' ? 'Habis' : 'Tersedia';
                    return { ...p, stockStatus: nextStatus };
                }
                return p;
            });
        });

        try {
            await toggleProductStock(id);
        } catch (err) {
            console.warn('Gagal sinkron toggle stok ke server:', err.message);
        }

        if (typeof onRefreshData === 'function') {
            try {
                await onRefreshData();
            } catch (_) { }
        }
    };

    const handleConfirmDeleteProduct = async () => {
        if (!deletingProduct) return;
        const targetId = deletingProduct.id;

        setCurrentProducts((prev) => {
            const list = prev && prev.length > 0 ? prev : activeProducts;
            return list.filter((p) => p.id !== targetId);
        });
        setDeletingProduct(null);

        try {
            await deleteProduct(targetId);
        } catch (err) {
            console.warn('Gagal menghapus produk di server:', err.message);
        }

        if (typeof onRefreshData === 'function') {
            try {
                await onRefreshData();
            } catch (_) { }
        }
    };

    // --- Handlers: Category Management ---
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setCatError('');
        const trimmed = newCatName.trim();
        if (!trimmed) return;

        let createdCat = null;
        try {
            const res = await createCategory(trimmed);
            createdCat = res?.data || res;
        } catch (err) {
            setCatError(err.message || 'Gagal menambahkan kategori');
        }

        const newCatObj = {
            id: createdCat?.id || `cat-${Date.now()}`,
            name: trimmed,
            slug: trimmed.toLowerCase().replace(/\s+/g, '-'),
            productCount: 0
        };

        setCurrentCategories((prev) => [...(prev && prev.length > 0 ? prev : activeCategories), newCatObj]);
        setNewCatName('');

        if (typeof onRefreshData === 'function') {
            try {
                await onRefreshData();
            } catch (_) { }
        }
    };

    const handleStartEditCategory = (cat) => {
        setEditingCategory(cat);
        setEditCatName(cat.name);
        setCatError('');
    };

    const handleSaveEditCategory = async (id) => {
        const trimmed = editCatName.trim();
        if (!trimmed) return;

        setCurrentCategories((prev) => {
            const list = prev && prev.length > 0 ? prev : activeCategories;
            return list.map((c) => (c.id === id ? { ...c, name: trimmed } : c));
        });
        setEditingCategory(null);

        try {
            await updateCategory(id, trimmed);
        } catch (err) {
            setCatError(err.message || 'Gagal memperbarui kategori');
        }

        if (typeof onRefreshData === 'function') {
            try {
                await onRefreshData();
            } catch (_) { }
        }
    };

    const handleConfirmDeleteCategory = async () => {
        if (!deletingCategory) return;
        const targetId = deletingCategory.id;

        setCurrentCategories((prev) => {
            const list = prev && prev.length > 0 ? prev : activeCategories;
            return list.filter((c) => c.id !== targetId);
        });
        setDeletingCategory(null);

        try {
            await deleteCategory(targetId);
        } catch (err) {
            alert(err.message);
        }

        if (typeof onRefreshData === 'function') {
            try {
                await onRefreshData();
            } catch (_) { }
        }
    };

    // --- Handlers: Store Settings ---
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await updateStoreSettings(settingsForm);
            setSettingsSuccess(true);
            if (typeof onRefreshData === 'function') {
                await onRefreshData();
            }
            setTimeout(() => setSettingsSuccess(false), 3000);
        } catch (err) {
            alert(`Gagal menyimpan pengaturan: ${err.message}`);
        }
    };

    return (
        <div className="admin-sidebar-layout animate-fade-in">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpenMobile && (
                <div
                    className="sidebar-backdrop-mobile"
                    onClick={() => setIsSidebarOpenMobile(false)}
                />
            )}

            {/* ===========================================================
          ADMIN SIDEBAR NAVIGATION
         =========================================================== */}
            <aside className={`admin-sidebar ${isSidebarOpenMobile ? 'open' : ''}`}>
                {/* Sidebar Header / Brand */}
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <ShoppingBag size={22} color="#ffffff" />
                    </div>
                    <div className="sidebar-brand-text">
                        <div className="sidebar-brand-title">{storeSettings?.storeName || 'AgriFresh'}</div>
                        <div className="sidebar-brand-badge">{storeSettings?.tagline || 'Admin Fresh Market'}</div>
                    </div>
                    <button
                        className="sidebar-close-mobile"
                        onClick={() => setIsSidebarOpenMobile(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Database Status Indicator */}
                <div className="sidebar-db-badge">
                    <Database size={13} className="text-emerald" />
                    <span>Database: <strong>SQLite (SQL)</strong></span>
                    <span className="db-live-dot"></span>
                </div>

                {/* Sidebar Nav Items */}
                <nav className="sidebar-nav">
                    <div className="nav-section-title">Menu Utama</div>

                    <button
                        className={`sidebar-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('products');
                            setIsSidebarOpenMobile(false);
                        }}
                        id="sidebar-link-products"
                    >
                        <Package size={18} />
                        <span className="nav-item-label">Manajemen Produk</span>
                        <span className="nav-badge-count">{totalCount}</span>
                    </button>

                    <button
                        className={`sidebar-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('categories');
                            setIsSidebarOpenMobile(false);
                        }}
                        id="sidebar-link-categories"
                    >
                        <Layers size={18} />
                        <span className="nav-item-label">Manajemen Kategori</span>
                        <span className="nav-badge-count">{activeCategories.length}</span>
                    </button>

                    <button
                        className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('settings');
                            setIsSidebarOpenMobile(false);
                        }}
                        id="sidebar-link-settings"
                    >
                        <Settings size={18} />
                        <span className="nav-item-label">Pengaturan Toko & WA</span>
                    </button>

                    <div className="nav-section-title" style={{ marginTop: '1.25rem' }}>Akses Cepat</div>

                    <button
                        className="sidebar-nav-item nav-item-ghost"
                        onClick={onBackToCatalog}
                        id="sidebar-link-view-catalog"
                    >
                        <Store size={18} />
                        <span className="nav-item-label">Lihat Katalog Pelanggan</span>
                        <ChevronRight size={14} className="nav-arrow" />
                    </button>
                </nav>

                {/* Sidebar Footer User Info & Logout */}
                <div className="sidebar-footer">
                    <div className="sidebar-user-card">
                        <div className="user-avatar"><ShieldCheck size={18} color="#10b981" /></div>
                        <div className="user-info">
                            <strong className="user-name">{adminUser?.name || profileForm.name || 'Store Owner'}</strong>
                            <span className="user-email">{adminUser?.email || profileForm.email || 'admin@katalogwa.com'}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setIsProfileModalOpen(true)}
                            style={{ flex: 1 }}
                            title="Ubah Profil Admin"
                        >
                            Edit Profil
                        </button>
                        <button
                            type="button"
                            className="sidebar-logout-btn"
                            onClick={onLogout}
                            id="sidebar-logout-btn"
                            title="Keluar dari sesi admin"
                            style={{ flex: 1, justifyContent: 'center' }}
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ===========================================================
          MAIN VIEWPORT CONTENT
         =========================================================== */}
            <div className="admin-main-viewport">
                {/* Top Navbar */}
                <header className="viewport-top-bar">
                    <div className="top-bar-left">
                        <button
                            className="mobile-hamburger-btn"
                            onClick={() => setIsSidebarOpenMobile(true)}
                            title="Buka menu navigasi"
                        >
                            <Menu size={22} />
                        </button>
                        <div>
                            <h2 className="viewport-title">
                                {activeTab === 'products' && 'Manajemen Produk Katalog'}
                                {activeTab === 'categories' && 'Manajemen Kategori'}
                                {activeTab === 'settings' && 'Pengaturan Toko & Nomor WhatsApp'}
                            </h2>
                            <span className="viewport-breadcrumb">
                                Admin Panel / {activeTab === 'products' ? 'Produk' : activeTab === 'categories' ? 'Kategori' : 'Pengaturan'}
                            </span>
                        </div>
                    </div>

                    <div className="top-bar-right" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={fetchDataFromApi}
                            disabled={isLoadingData}
                            title="Segarkan data produk & kategori"
                        >
                            <RefreshCw size={14} className={isLoadingData ? 'animate-spin' : ''} />
                            <span>{isLoadingData ? 'Memuat...' : 'Segarkan'}</span>
                        </button>

                        <button className="btn btn-secondary btn-sm" onClick={onBackToCatalog}>
                            <Store size={15} />
                            <span>Katalog Publik</span>
                        </button>
                    </div>
                </header>

                {/* Main Body */}
                <main className="viewport-content-container">
                    {/* Metrics Summary Strip */}
                    <div className="metrics-grid" style={{ marginBottom: '1.75rem' }}>
                        <div className="metric-card">
                            <div className="metric-icon-box bg-emerald">
                                <Package size={22} color="#059669" />
                            </div>
                            <div>
                                <span className="metric-label">Total Produk</span>
                                <h3 className="metric-value">{totalCount}</h3>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon-box bg-green">
                                <CheckCircle size={22} color="#10b981" />
                            </div>
                            <div>
                                <span className="metric-label">Produk Tersedia</span>
                                <h3 className="metric-value text-emerald">{availableCount}</h3>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon-box bg-red">
                                <XCircle size={22} color="#ef4444" />
                            </div>
                            <div>
                                <span className="metric-label">Stok Habis</span>
                                <h3 className="metric-value text-danger">{outCount}</h3>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon-box bg-slate">
                                <Layers size={22} color="#475569" />
                            </div>
                            <div>
                                <span className="metric-label">Total Kategori</span>
                                <h3 className="metric-value">{activeCategories.length}</h3>
                            </div>
                        </div>
                    </div>

                    {/* ===========================================================
              MODULE 1: PRODUCT MANAGEMENT
             =========================================================== */}
                    {activeTab === 'products' && (
                        <div className="admin-tab-content animate-fade-in">
                            <div className="table-controls-bar">
                                <div className="table-search-group">
                                    <div className="search-input-wrapper table-search-input-wrapper">
                                        <Search size={16} className="search-icon" />
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Cari nama / kategori produk..."
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                        />
                                        {productSearch && (
                                            <button
                                                type="button"
                                                onClick={() => setProductSearch('')}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-muted)'
                                                }}
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <select
                                        className="form-select filter-select"
                                        value={productCategoryFilter}
                                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                                    >
                                        <option value="">Semua Kategori ({totalCount})</option>
                                        {activeCategories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="table-actions-top">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleOpenAddProduct}
                                        id="btn-add-product"
                                    >
                                        <Plus size={18} />
                                        <span>+ Tambah Produk</span>
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Scroll Hint */}
                            <div className="table-scroll-hint">
                                <span>← Geser ke samping untuk melihat detail & status stok →</span>
                            </div>

                            {/* Products Table */}
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Foto</th>
                                            <th>Nama & Deskripsi</th>
                                            <th>Kategori</th>
                                            <th>Harga</th>
                                            <th style={{ textAlign: 'center' }}>Status Stok (Saklar)</th>
                                            <th style={{ textAlign: 'right' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="table-empty-cell" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                                        <Package size={40} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                                                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)', fontSize: '1rem' }}>
                                                            {productSearch || productCategoryFilter
                                                                ? 'Tidak ada produk yang cocok dengan pencarian atau filter kategori ini.'
                                                                : 'Belum ada produk yang terdaftar di database.'}
                                                        </p>
                                                        {(productSearch || productCategoryFilter) ? (
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => {
                                                                    setProductSearch('');
                                                                    setProductCategoryFilter('');
                                                                }}
                                                            >
                                                                Reset Filter & Pencarian
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-sm"
                                                                onClick={handleOpenAddProduct}
                                                            >
                                                                <Plus size={16} />
                                                                <span>Tambah Produk Pertama</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProducts.map((prod) => {
                                                const isAvailable = (prod.stockStatus || prod.stock_status || '') === 'Tersedia';
                                                const rawImg = (prod.image && prod.image !== '-' && prod.image !== '_' && typeof prod.image === 'string' && prod.image.trim() !== '') ? prod.image.trim() : '';
                                                const prodImg = rawImg.startsWith('uploads/') ? `/${rawImg}` : (rawImg || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');

                                                return (
                                                    <tr key={prod.id} className={!isAvailable ? 'row-out-of-stock' : ''}>
                                                        {/* Image */}
                                                        <td style={{ width: '64px' }}>
                                                            <img
                                                                src={prodImg}
                                                                alt={prod.name}
                                                                className="table-product-thumb"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
                                                                }}
                                                            />
                                                        </td>

                                                        {/* Name & Desc */}
                                                        <td>
                                                            <strong className="table-product-name">{prod.name}</strong>
                                                            {prod.description && (
                                                                <p className="table-product-desc">{prod.description}</p>
                                                            )}
                                                        </td>

                                                        {/* Category */}
                                                        <td>
                                                            <span className="badge badge-category">
                                                                {prod.categoryName}
                                                            </span>
                                                        </td>

                                                        {/* Price */}
                                                        <td>
                                                            <strong className="table-product-price">
                                                                {formatRupiah(prod.price)}{' '}
                                                                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                                                                    / {prod.unit || 'kg'}
                                                                </span>
                                                            </strong>
                                                        </td>

                                                        {/* Toggle Stock Switch */}
                                                        <td style={{ textAlign: 'center' }}>
                                                            <div className="stock-toggle-cell">
                                                                <label className="switch" title="Ubah status ketersediaan stok di SQL database">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isAvailable}
                                                                        onChange={() => handleToggleStock(prod.id)}
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                                <span className={`stock-text-status ${isAvailable ? 'text-emerald' : 'text-danger'}`}>
                                                                    {prod.stockStatus}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* Actions */}
                                                        <td style={{ textAlign: 'right' }}>
                                                            <div className="table-actions-group">
                                                                <button
                                                                    className="btn-icon"
                                                                    onClick={() => handleOpenEditProduct(prod)}
                                                                    title="Edit Produk"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    className="btn-icon btn-icon-danger"
                                                                    onClick={() => setDeletingProduct(prod)}
                                                                    title="Hapus Produk"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ===========================================================
              MODULE 2: CATEGORY MANAGEMENT
             =========================================================== */}
                    {activeTab === 'categories' && (
                        <div className="admin-tab-content animate-fade-in">
                            <div className="category-manager-grid">
                                {/* Form Add Category */}
                                <div className="card-box">
                                    <h3 className="box-title">Tambah Kategori Baru</h3>
                                    <p className="box-subtitle">
                                        Kategori tersimpan di tabel SQL <code>categories</code> dan tampil sebagai tombol filter pill di katalog pelanggan.
                                    </p>

                                    {catError && (
                                        <div className="form-alert-error" style={{ marginBottom: '1rem' }}>
                                            <AlertCircle size={16} />
                                            <span>{catError}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleAddCategory}>
                                        <div className="form-group">
                                            <label className="form-label">Nama Kategori</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="cth: Sayur Hidroponik, Buah Impor..."
                                                value={newCatName}
                                                onChange={(e) => setNewCatName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                            <Plus size={16} />
                                            <span>Tambah Kategori ke Database SQL</span>
                                        </button>
                                    </form>
                                </div>

                                {/* List of Categories */}
                                <div className="card-box">
                                    <h3 className="box-title">Daftar Kategori ({activeCategories.length})</h3>
                                    <div className="category-items-list">
                                        {activeCategories.map((cat) => (
                                            <div key={cat.id} className="category-item-row">
                                                {editingCategory?.id === cat.id ? (
                                                    <div className="category-inline-edit">
                                                        <input
                                                            type="text"
                                                            className="form-input"
                                                            value={editCatName}
                                                            onChange={(e) => setEditCatName(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleSaveEditCategory(cat.id)}
                                                        >
                                                            <Save size={14} />
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => setEditingCategory(null)}
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="cat-name-info">
                                                            <strong>{cat.name}</strong>
                                                            <span className="badge badge-category" style={{ fontSize: '0.75rem' }}>
                                                                {cat.productCount !== undefined ? cat.productCount : 0} Produk Terdaftar
                                                            </span>
                                                        </div>

                                                        <div className="cat-actions">
                                                            <button
                                                                className="btn-icon"
                                                                onClick={() => handleStartEditCategory(cat)}
                                                                title="Ubah Nama"
                                                            >
                                                                <Edit2 size={15} />
                                                            </button>
                                                            <button
                                                                className="btn-icon btn-icon-danger"
                                                                onClick={() => setDeletingCategory(cat)}
                                                                title="Hapus Kategori"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===========================================================
              MODULE 3: STORE SETTINGS
             =========================================================== */}
                    {activeTab === 'settings' && (
                        <div className="admin-tab-content animate-fade-in">
                            <div className="card-box" style={{ maxWidth: '640px' }}>
                                <h3 className="box-title">Pengaturan Profil & WhatsApp Toko</h3>
                                <p className="box-subtitle">
                                    Konfigurasi disimpan di tabel SQL <code>settings</code>. Digunakan untuk redirect WhatsApp pesanan pelanggan.
                                </p>

                                {settingsSuccess && (
                                    <div className="form-alert-success animate-fade-in" style={{ marginBottom: '1rem' }}>
                                        <Check size={18} />
                                        <span>Pengaturan toko berhasil diperbarui ke database SQL!</span>
                                    </div>
                                )}

                                <form onSubmit={handleSaveSettings}>
                                    <div className="form-group">
                                        <label className="form-label">Nama Bisnis / Toko</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={settingsForm.storeName}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Tagline Toko</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={settingsForm.tagline}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <PhoneCall size={15} />
                                            <span>Nomor WhatsApp Tujuan (Gunakan kode negara, cth: 6281234567890)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="6281234567890"
                                            value={settingsForm.phone}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                                            required
                                        />
                                        <small style={{ color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                                            Nomor ini yang akan menerima chat otomatis saat pelanggan mengklik "Kirim Pesanan ke WhatsApp".
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Alamat Toko</label>
                                        <textarea
                                            rows="2"
                                            className="form-textarea"
                                            value={settingsForm.address}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                        <Save size={16} />
                                        <span>Simpan Pengaturan ke SQL</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Product Form Modal (Add / Edit) */}
            <ProductFormModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSave={handleSaveProduct}
                editingProduct={editingProduct}
                categories={activeCategories}
            />

            {/* Confirm Delete Product Modal */}
            <ConfirmModal
                isOpen={!!deletingProduct}
                title="Hapus Produk Ini?"
                message={`Apakah Anda yakin ingin menghapus "${deletingProduct?.name}" dari database SQL? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleConfirmDeleteProduct}
                onCancel={() => setDeletingProduct(null)}
                confirmText="Hapus Produk"
            />

            {/* Confirm Delete Category Modal */}
            <ConfirmModal
                isOpen={!!deletingCategory}
                title="Hapus Kategori Ini?"
                message={`Apakah Anda yakin ingin menghapus kategori "${deletingCategory?.name}" dari database SQL?`}
                onConfirm={handleConfirmDeleteCategory}
                onCancel={() => setDeletingCategory(null)}
                confirmText="Hapus Kategori"
            />

            {/* Profile Edit Modal */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={handleSaveProfile}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                profileError={profileError}
                profileSuccess={profileSuccess}
            />
        </div>
    );
};

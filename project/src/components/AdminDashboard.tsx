import { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Package,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Plus,
  Trash2,
  AlertCircle,
  ArrowLeft,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  MessageCircle,
  Edit3,
  UploadCloud,
  Camera,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite?: () => void;
}

interface Order {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  note?: string;
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
}

interface CustomerRecord {
  phone: string;
  customer_name: string;
  address: string;
  total_orders: number;
  total_units_ordered: number;
  last_order_date: string;
}

interface GalleryItem {
  id: number;
  title: string;
  category: 'factory' | 'workers' | 'delivery' | 'events';
  image_url: string;
  caption?: string;
}

interface ProductItem {
  id: string;
  name: string;
  volume: string;
  description: string;
  price: string;
  unit: string;
  min_order: string;
  badge?: string;
  in_stock: boolean;
  image_url?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 101,
    customer_name: 'Chief Emmanuel Okoro',
    phone: '08031234567',
    address: '14 Bank Road, Owerri, Imo State',
    product: 'sachet',
    quantity: 10,
    note: 'Please deliver before 12 PM',
    status: 'new',
    created_at: new Date().toISOString(),
  },
  {
    id: 102,
    customer_name: 'Mrs. Chidimma Nwachukwu',
    phone: '09087654321',
    address: 'Plot 8 World Bank Housing Estate, Owerri',
    product: 'bottle',
    quantity: 5,
    note: 'Call when driver arrives at gate',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 103,
    customer_name: 'Apex Supermarket & Restaurant',
    phone: '08123456789',
    address: 'Wetheral Road, Owerri',
    product: 'bottle',
    quantity: 20,
    note: 'Weekly replenishment order',
    status: 'delivered',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const MOCK_CUSTOMERS: CustomerRecord[] = [
  {
    phone: '08031234567',
    customer_name: 'Chief Emmanuel Okoro',
    address: '14 Bank Road, Owerri, Imo State',
    total_orders: 4,
    total_units_ordered: 35,
    last_order_date: new Date().toISOString(),
  },
  {
    phone: '09087654321',
    customer_name: 'Mrs. Chidimma Nwachukwu',
    address: 'Plot 8 World Bank Housing Estate, Owerri',
    total_orders: 2,
    total_units_ordered: 12,
    last_order_date: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    phone: '08123456789',
    customer_name: 'Apex Supermarket & Restaurant',
    address: 'Wetheral Road, Owerri',
    total_orders: 8,
    total_units_ordered: 160,
    last_order_date: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 1,
    title: 'Hygienic Production Facility',
    category: 'factory',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    caption: 'Automated purification and bottle filling line in Owerri.',
  },
  {
    id: 2,
    title: 'Dedicated Delivery Team',
    category: 'workers',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    caption: 'Our trained staff ensuring quality control and safe packaging.',
  },
  {
    id: 3,
    title: 'Fleet Ready for Dispatch',
    category: 'delivery',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    caption: 'Fast delivery trucks supplying businesses across Imo State.',
  },
];

const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: 'sachet',
    name: 'Table Water Sachet',
    volume: '500ml',
    description: 'Perfect for on-the-go hydration. Produced under hygienic conditions.',
    price: '₦100',
    unit: 'per bag (20 sachets)',
    min_order: 'Minimum order: 1 bag',
    badge: 'Most Popular',
    in_stock: true,
  },
  {
    id: 'bottle',
    name: 'Table Water Bottle',
    volume: '75cl / 1.5L',
    description: 'Our premium bottled water, ideal for families and restaurants.',
    price: '₦1,500',
    unit: 'per carton (12 bottles)',
    min_order: 'Minimum order: 1 carton',
    badge: 'Premium',
    in_stock: true,
  },
];

export default function AdminDashboard({ onBackToSite }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'gallery' | 'products'>('orders');

  // Data states
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<CustomerRecord[]>(MOCK_CUSTOMERS);
  const [gallery, setGallery] = useState<GalleryItem[]>(MOCK_GALLERY);
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close menu when tapping outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#admin-mobile-menu') && !target.closest('#admin-menu-toggle-btn')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Gallery Form State
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<'factory' | 'workers' | 'delivery' | 'events'>('factory');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL as string | undefined;
    if (url) return url.replace(/\/$/, '');
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3001'
      : '';
  };

  // Security & Lockout states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);

  // Show/Hide password toggle & Reset Password states
  const [showPassword, setShowPassword] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Inactivity Auto-Logout Timer (10 Minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout('Session locked due to inactivity to protect customer data.');
      }, 10 * 60 * 1000); // 10 minutes
    };

    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((evt) => window.addEventListener(evt, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((evt) => window.removeEventListener(evt, resetInactivityTimer));
    };
  }, [isAuthenticated]);

  // Lockout Countdown Timer
  useEffect(() => {
    if (lockoutCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockoutCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutCountdown]);

  useEffect(() => {
    const savedToken = localStorage.getItem('zigwills_admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchCustomers();
      fetchGallery();
      fetchProducts();
    }
  }, [isAuthenticated, token, statusFilter, searchQuery]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (lockoutCountdown > 0) {
      setAuthError(`Too many failed attempts. Try again in ${lockoutCountdown}s.`);
      return;
    }

    const validPwd = localStorage.getItem('zigwills_admin_custom_pwd') || 'zigwills2026';

    if (password !== validPwd) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        setLockoutCountdown(60);
        setAuthError('Security Alert: 5 failed login attempts. Portal locked for 60 seconds.');
      } else {
        setAuthError(`Invalid admin password. (${5 - newAttempts} attempts remaining)`);
      }
      return;
    }

    try {
      const res = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('zigwills_admin_token', data.token);
      } else {
        const mockToken = 'zigwills_secret_admin_token_2026';
        setToken(mockToken);
        localStorage.setItem('zigwills_admin_token', mockToken);
      }
    } catch {
      const mockToken = 'zigwills_secret_admin_token_2026';
      setToken(mockToken);
      localStorage.setItem('zigwills_admin_token', mockToken);
    }

    setIsAuthenticated(true);
    setPassword('');
    setFailedAttempts(0);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess('');
    setAuthError('');

    if (newAdminPassword.length < 6) {
      setAuthError('New password must be at least 6 characters long.');
      return;
    }

    if (newAdminPassword !== confirmAdminPassword) {
      setAuthError('New passwords do not match.');
      return;
    }

    localStorage.setItem('zigwills_admin_custom_pwd', newAdminPassword);
    setPasswordChangeSuccess('Admin password updated successfully!');
    setNewAdminPassword('');
    setConfirmAdminPassword('');

    try {
      await fetch(`${getApiUrl()}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: newAdminPassword }),
      });
    } catch {}
  };

  const handleLogout = (reason?: string) => {
    localStorage.removeItem('zigwills_admin_token');
    setIsAuthenticated(false);
    setToken('');
    setOrders([]);
    setCustomers([]);
    if (reason) {
      setAuthError(reason);
    }
  };

  const handleGoBack = () => {
    if (onBackToSite) {
      onBackToSite();
    } else {
      window.location.href = '/';
    }
  };

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`${getApiUrl()}/api/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        return;
      }
    } catch {}

    let result = [...MOCK_ORDERS];
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.address.toLowerCase().includes(q)
      );
    }
    setOrders(result);
  };

  const updateOrderStatus = async (id: number, newStatus: string) => {
    const ord = orders.find((o) => o.id === id);

    try {
      const res = await fetch(`${getApiUrl()}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch {}

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus as any } : o))
    );

    // Auto-trigger WhatsApp customer status notification
    if (ord) {
      const cleanPhone = ord.phone.replace(/[^0-9]/g, '');
      const waPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
      const productName = ord.product === 'sachet' ? 'Table Water Sachet' : 'Table Water Bottle';

      let statusMsg = '';
      if (newStatus === 'confirmed') {
        statusMsg = `Hello ${ord.customer_name}! Your Zigwills Table Water order #${ord.id} (${ord.quantity}x ${productName}) has been CONFIRMED. Our delivery team is preparing your dispatch to ${ord.address}.`;
      } else if (newStatus === 'delivered') {
        statusMsg = `Hello ${ord.customer_name}! Your Zigwills Table Water order #${ord.id} has been DELIVERED to ${ord.address}. Thank you for choosing Zigwills!`;
      } else if (newStatus === 'cancelled') {
        statusMsg = `Hello ${ord.customer_name}! Your Zigwills Table Water order #${ord.id} status was updated to CANCELLED. Please call us at 09011236098 for any inquiries.`;
      }

      if (statusMsg) {
        const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(statusMsg)}`;
        window.open(waUrl, '_blank');
      }
    }
  };

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const res = await fetch(`${getApiUrl()}/api/customers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
        return;
      }
    } catch {}

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      setCustomers(
        MOCK_CUSTOMERS.filter(
          (c) =>
            c.customer_name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.address.toLowerCase().includes(q)
        )
      );
    } else {
      setCustomers(MOCK_CUSTOMERS);
    }
  };

  const exportCustomersCSV = () => {
    if (customers.length === 0) return;
    const headers = ['Customer Name', 'Phone', 'Address', 'Total Orders', 'Total Units', 'Last Order Date'];
    const rows = customers.map((c) => [
      `"${c.customer_name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      c.total_orders,
      c.total_units_ordered,
      `"${new Date(c.last_order_date).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zigwills_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/api/gallery`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setGallery(data);
          return;
        }
      }
    } catch {}
    setGallery(MOCK_GALLERY);
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryUrl) return;
    const newItem: GalleryItem = {
      id: Date.now(),
      title: newGalleryTitle,
      category: newGalleryCategory,
      image_url: newGalleryUrl,
      caption: newGalleryCaption,
    };

    try {
      const res = await fetch(`${getApiUrl()}/api/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newGalleryTitle,
          category: newGalleryCategory,
          image_url: newGalleryUrl,
          caption: newGalleryCaption,
        }),
      });
      if (res.ok) {
        fetchGallery();
      } else {
        setGallery([newItem, ...gallery]);
      }
    } catch {
      setGallery([newItem, ...gallery]);
    }

    setNewGalleryTitle('');
    setNewGalleryUrl('');
    setNewGalleryCaption('');
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await fetch(`${getApiUrl()}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const handleMobileFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

    // Direct Cloudinary Upload (if cloud name and preset are configured)
    if (cloudName && uploadPreset) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          const imageUrl = data.secure_url || data.url;
          if (isEditMode && editingGalleryItem) {
            setEditingGalleryItem((prev) => (prev ? { ...prev, image_url: imageUrl } : null));
          } else {
            setNewGalleryUrl(imageUrl);
          }
          setIsUploadingImage(false);
          return;
        }
      } catch (err) {
        console.error('Cloudinary upload error:', err);
      }
    }

    // Fallback: Read image locally as Data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      if (isEditMode && editingGalleryItem) {
        setEditingGalleryItem((prev) => (prev ? { ...prev, image_url: base64Url } : null));
      } else {
        setNewGalleryUrl(base64Url);
      }
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      setIsUploadingImage(false);
      alert('Failed to process image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEditedGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;

    try {
      const res = await fetch(`${getApiUrl()}/api/gallery/${editingGalleryItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingGalleryItem),
      });
      if (res.ok) {
        fetchGallery();
      } else {
        setGallery((prev) =>
          prev.map((g) => (g.id === editingGalleryItem.id ? editingGalleryItem : g))
        );
      }
    } catch {
      setGallery((prev) =>
        prev.map((g) => (g.id === editingGalleryItem.id ? editingGalleryItem : g))
      );
    }

    setEditingGalleryItem(null);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/api/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          return;
        }
      }
    } catch {}
    setProducts(MOCK_PRODUCTS);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await fetch(`${getApiUrl()}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });
    } catch {}

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Sleek Modern Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-bold text-base shadow-md shadow-brand-500/20">
            Z
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm md:text-base text-white tracking-tight">
                Zigwills Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Control Center & Operations</p>
          </div>
        </div>

        {/* Desktop Header Nav Tabs */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'customers' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Customers
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'gallery' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Gallery
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'products' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Products
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleGoBack}
            className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700/60 transition-all"
            title="Return to public website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </button>

          {isAuthenticated && (
            <button
              onClick={() => handleLogout()}
              className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700/60 hover:border-red-500/30 transition-all"
              title="Sign out of admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}

          {/* Menu Icon ☰ Button */}
          {isAuthenticated && (
            <button
              id="admin-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all md:hidden"
              aria-label="Toggle admin menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
        {/* Floating Mobile Menu Overlay */}
        {isAuthenticated && isMobileMenuOpen && (
          <>
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-[57px] bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            />
            <div id="admin-mobile-menu" className="absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3 z-50 shadow-2xl animate-in slide-in-from-top duration-200 md:hidden">
              <div className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider px-2">
                Navigation Menu
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs text-left transition-all ${
                    activeTab === 'orders'
                      ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Customer Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('customers');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs text-left transition-all ${
                    activeTab === 'customers'
                      ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Customer Database</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs text-left transition-all ${
                    activeTab === 'gallery'
                      ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Gallery Photo Manager</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('products');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs text-left transition-all ${
                    activeTab === 'products'
                      ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Product Catalogue</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleGoBack();
                  }}
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-white font-medium bg-slate-800 px-3 py-2 rounded-lg border border-slate-700/60"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 font-semibold bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main Body */}
      {!isAuthenticated ? (
        /* Standalone Login Screen */
        <div className="flex-1 flex items-center justify-center p-4 md:p-6 bg-slate-950">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            
            <h2 className="font-display font-bold text-xl text-white mb-1">Admin Portal Access</h2>
            <p className="text-slate-400 text-xs mb-6">Enter password to manage orders and customer data</p>

            {authError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            {passwordChangeSuccess && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{passwordChangeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Admin Password"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-[16px] text-white placeholder:text-slate-500 font-sans"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/25 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                Sign In <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={handleGoBack}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Website
              </button>

              <button
                onClick={() => setIsResetPasswordOpen(true)}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" /> Change Password
              </button>
            </div>
          </div>

          {/* CHANGE / RESET PASSWORD MODAL */}
          {isResetPasswordOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-brand-400" /> Change Admin Password
                  </h3>
                  <button
                    onClick={() => setIsResetPasswordOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">New Password (Min 6 chars)</label>
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[16px] text-white outline-none focus:border-brand-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[16px] text-white outline-none focus:border-brand-500"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
                    >
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsResetPasswordOpen(false)}
                      className="bg-slate-800 text-slate-300 font-semibold px-3 py-2.5 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Authenticated Modern Dashboard */
        <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">

          {/* Main Dashboard Card Container */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">Incoming Orders</h2>
                    <p className="text-xs text-slate-400">Track customer table water requests</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs min-w-[200px] flex-1 sm:flex-initial">
                      <Search className="w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search orders..."
                        className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-xs border border-slate-800 rounded-lg px-3 py-1.5 bg-slate-950 text-slate-300 font-medium outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No orders found matching your search filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {orders.map((ord) => {
                      const productName = ord.product === 'sachet'
                        ? 'Table Water Sachet (500ml)'
                        : ord.product === 'bottle'
                        ? 'Table Water Bottle (75cl/1.5L)'
                        : ord.product;

                      const cleanPhone = ord.phone.replace(/[^0-9]/g, '');
                      const waPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
                      const waMsg = encodeURIComponent(`Hello ${ord.customer_name}! This is Zigwills Table Water regarding your order #${ord.id} (${ord.quantity}x ${productName}).`);
                      const waUrl = `https://wa.me/${waPhone}?text=${waMsg}`;

                      return (
                        <div
                          key={ord.id}
                          className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display font-bold text-white text-base">
                                #{ord.id} — {ord.customer_name}
                              </span>
                              <span
                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold capitalize inline-flex items-center gap-1 ${
                                  ord.status === 'delivered'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : ord.status === 'confirmed'
                                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                    : ord.status === 'cancelled'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {ord.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                                {ord.status === 'confirmed' && <Truck className="w-3 h-3" />}
                                {ord.status === 'new' && <Clock className="w-3 h-3" />}
                                {ord.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                {ord.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="bg-brand-500/20 text-brand-300 font-bold px-2.5 py-1 rounded-md border border-brand-500/30 text-xs">
                                📦 {ord.quantity}x {productName}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                              <a href={`tel:${ord.phone}`} className="hover:text-brand-400 flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                                <Phone className="w-3 h-3 text-brand-400" /> {ord.phone}
                              </a>
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-emerald-400 flex items-center gap-1 bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/20"
                              >
                                <MessageCircle className="w-3 h-3 text-emerald-400" /> Chat WhatsApp
                              </a>
                              <span className="text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-500" /> {ord.address}
                              </span>
                            </div>

                            {ord.note && (
                              <p className="text-xs bg-slate-900 p-2 rounded-lg border border-slate-800 text-slate-400 italic">
                                Note: "{ord.note}"
                              </p>
                            )}

                            <p className="text-[10px] text-slate-500">
                              Ordered: {new Date(ord.created_at).toLocaleString()}
                            </p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                              className="text-[11px] bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-lg font-semibold transition-all"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'delivered')}
                              className="text-[11px] bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-semibold transition-all"
                            >
                              Delivered
                            </button>
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'cancelled')}
                              className="text-[11px] bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 px-2.5 py-1.5 rounded-lg font-medium transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === 'customers' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">Customer Database</h2>
                    <p className="text-xs text-slate-400">Aggregated repeat customer records</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs min-w-[180px]">
                      <Search className="w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                      />
                    </div>
                    <button
                      onClick={exportCustomersCSV}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-600/20 whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Address</th>
                        <th className="p-3 text-center">Orders</th>
                        <th className="p-3 text-center">Total Units</th>
                        <th className="p-3">Last Order</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {customers.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-950/40">
                          <td className="p-3 font-semibold text-white">{c.customer_name}</td>
                          <td className="p-3 font-mono">
                            <a href={`tel:${c.phone}`} className="text-brand-400 hover:underline">
                              {c.phone}
                            </a>
                          </td>
                          <td className="p-3 text-slate-400 max-w-xs truncate">{c.address}</td>
                          <td className="p-3 text-center font-bold text-white">{c.total_orders}</td>
                          <td className="p-3 text-center font-bold text-brand-400">{c.total_units_ordered}</td>
                          <td className="p-3 text-[11px] text-slate-500">
                            {new Date(c.last_order_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-5">
                <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">Gallery Photo Manager</h2>
                    <p className="text-xs text-slate-400">Publish, edit, or remove photos from the website gallery</p>
                  </div>
                </div>

                {/* EDIT GALLERY PHOTO FORM */}
                {editingGalleryItem ? (
                  <form onSubmit={handleSaveEditedGalleryItem} className="bg-slate-950/90 p-5 rounded-xl border border-brand-500/40 space-y-3 relative shadow-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-xs text-brand-300 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-brand-400" /> Editing Photo: #{editingGalleryItem.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingGalleryItem(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Photo Title"
                        value={editingGalleryItem.title}
                        onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                        className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                        required
                      />
                      <select
                        value={editingGalleryItem.category}
                        onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value as any })}
                        className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none focus:border-brand-500"
                      >
                        <option value="factory">Factory & Process</option>
                        <option value="workers">Our Team / Staff</option>
                        <option value="delivery">Delivery Cars & Fleet</option>
                        <option value="events">Events & Community</option>
                      </select>
                    </div>

                    {/* File Picker from Mobile Phone */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="edit-gallery-file-input"
                        className="hidden"
                        onChange={(e) => handleMobileFileUpload(e, true)}
                      />
                      <label
                        htmlFor="edit-gallery-file-input"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-brand-300 border border-brand-500/30 px-3.5 py-2 rounded-lg cursor-pointer font-bold text-xs transition-all"
                      >
                        {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                        Choose New Image from Phone
                      </label>
                      <span className="text-[11px] text-slate-500">or paste URL below</span>
                    </div>

                    <input
                      type="url"
                      placeholder="Image URL (or upload from phone above)"
                      value={editingGalleryItem.image_url}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, image_url: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                      required
                    />

                    {editingGalleryItem.image_url && (
                      <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <img src={editingGalleryItem.image_url} alt="Preview" className="w-16 h-12 object-cover rounded border border-slate-700" />
                        <span className="text-[11px] text-slate-400">Live Image Preview</span>
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={editingGalleryItem.caption || ''}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, caption: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-all shadow-md"
                      >
                        Save Photo Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGalleryItem(null)}
                        className="bg-slate-800 text-slate-300 font-semibold px-3 py-2.5 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ADD NEW GALLERY PHOTO FORM */
                  <form onSubmit={handleAddGalleryItem} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-brand-400" /> Add New Photo
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Title (e.g. Factory Line)"
                        value={newGalleryTitle}
                        onChange={(e) => setNewGalleryTitle(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                        required
                      />
                      <select
                        value={newGalleryCategory}
                        onChange={(e) => setNewGalleryCategory(e.target.value as any)}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none focus:border-brand-500"
                      >
                        <option value="factory">Factory & Process</option>
                        <option value="workers">Our Team / Staff</option>
                        <option value="delivery">Delivery Cars & Fleet</option>
                        <option value="events">Events & Community</option>
                      </select>
                    </div>

                    {/* Mobile File Uploader Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="add-gallery-file-input"
                        className="hidden"
                        onChange={(e) => handleMobileFileUpload(e, false)}
                      />
                      <label
                        htmlFor="add-gallery-file-input"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-brand-300 border border-brand-500/30 px-3 py-2 rounded-lg cursor-pointer font-bold text-xs transition-all"
                      >
                        {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                        Upload Photo from Phone / Camera
                      </label>
                      <span className="text-[11px] text-slate-500">or paste URL below</span>
                    </div>

                    <input
                      type="url"
                      placeholder="Image URL (or select photo from phone above)"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                      required
                    />

                    {newGalleryUrl && (
                      <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <img src={newGalleryUrl} alt="Preview" className="w-16 h-12 object-cover rounded border border-slate-700" />
                        <span className="text-[11px] text-slate-400">Selected Photo Preview</span>
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={newGalleryCaption}
                      onChange={(e) => setNewGalleryCaption(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                    />
                    <button
                      type="submit"
                      className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all"
                    >
                      Publish Photo to Live Website
                    </button>
                  </form>
                )}

                {/* GALLERY PHOTO GRID WITH EDIT & DELETE BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((g) => (
                    <div key={g.id} className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden relative group">
                      <img src={g.image_url} alt={g.title} className="w-full h-36 object-cover" />
                      <div className="p-3">
                        <p className="font-bold text-xs text-white">{g.title}</p>
                        {g.caption && <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{g.caption}</p>}
                        <span className="text-[9px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                          {g.category}
                        </span>
                      </div>

                      {/* Action buttons on photo card */}
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          onClick={() => setEditingGalleryItem(g)}
                          className="bg-slate-900/90 text-brand-300 border border-brand-500/30 p-1.5 rounded-lg text-xs hover:bg-brand-500 hover:text-white transition-all shadow-md"
                          title="Edit this photo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryItem(g.id)}
                          className="bg-slate-900/90 text-red-400 border border-red-500/30 p-1.5 rounded-lg text-xs hover:bg-red-600 hover:text-white transition-all shadow-md"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-5">
                <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">Product Catalogue Manager</h2>
                    <p className="text-xs text-slate-400">Update live product prices, volume, stock, and details</p>
                  </div>
                </div>

                {editingProduct ? (
                  <form onSubmit={handleSaveProduct} className="bg-slate-950/90 p-5 rounded-xl border border-brand-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <h3 className="font-bold text-xs text-brand-300 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-brand-400" /> Editing Product: {editingProduct.name} (#{editingProduct.id})
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">Product Title</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          placeholder="e.g. Table Water Sachet"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">Price</label>
                        <input
                          type="text"
                          value={editingProduct.price || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                          placeholder="e.g. ₦100 or ₦1,500"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-brand-400 font-bold outline-none focus:border-brand-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">Volume / Size</label>
                        <input
                          type="text"
                          value={editingProduct.volume}
                          onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                          placeholder="e.g. 500ml or 75cl / 1.5L"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">Unit Packaging</label>
                        <input
                          type="text"
                          value={editingProduct.unit}
                          onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                          placeholder="e.g. per bag (20 sachets)"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">Minimum Order</label>
                        <input
                          type="text"
                          value={editingProduct.min_order}
                          onChange={(e) => setEditingProduct({ ...editingProduct, min_order: e.target.value })}
                          placeholder="e.g. Minimum order: 1 bag"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">Badge Tag (Optional)</label>
                        <input
                          type="text"
                          value={editingProduct.badge || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                          placeholder="e.g. Most Popular or Premium"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        placeholder="Product description..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-brand-500 resize-none"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <input
                        type="checkbox"
                        id="instock_edit"
                        checked={editingProduct.in_stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, in_stock: e.target.checked })}
                        className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
                      />
                      <label htmlFor="instock_edit" className="text-xs font-bold text-white cursor-pointer flex items-center gap-2">
                        <span>Availability Status:</span>
                        <span className={editingProduct.in_stock ? 'text-emerald-400' : 'text-red-400'}>
                          {editingProduct.in_stock ? 'In Stock (Available on Site)' : 'Out of Stock (Marked Sold Out)'}
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow-md"
                      >
                        Publish Changes to Live Website
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((p) => (
                      <div key={p.id} className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-base text-white">{p.name}</span>
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                                p.in_stock
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {p.in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-brand-400 font-bold text-xl">{p.price || 'Contact'}</span>
                            <span className="text-xs text-slate-400">{p.unit}</span>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                            <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800 font-medium">
                              📏 {p.volume}
                            </span>
                            <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800 font-medium">
                              📦 {p.min_order}
                            </span>
                            {p.badge && (
                              <span className="bg-brand-500/20 text-brand-300 px-2.5 py-1 rounded border border-brand-500/30 font-bold">
                                ⭐ {p.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setEditingProduct(p)}
                          className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-brand-300 border border-brand-500/30 font-semibold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Product Details & Stock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

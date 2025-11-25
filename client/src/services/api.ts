import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import type { User, Product, Order, ApiResponse, Pagination } from '../types';
import { auth, db } from '../lib/firebase';

const withSuccess = <T>(data: T): ApiResponse<T> => ({
  success: true,
  ...data,
});

const withError = (message: string): ApiResponse<any> => ({
  success: false,
  message,
});

const mapProduct = (snapshot: any): Product => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    price: data.price,
    comparePrice: data.comparePrice,
    category: data.category,
    brand: data.brand,
    sku: data.sku,
    stockQuantity: data.stockQuantity,
    images: data.images || [],
    isFeatured: data.isFeatured ?? false,
    isActive: data.isActive ?? true,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  };
};

const mapOrder = (snapshot: any): Order => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    orderNumber: data.orderNumber,
    userId: data.userId,
    user: data.user,
    status: data.status,
    subtotal: data.subtotal,
    shippingCost: data.shippingCost,
    tax: data.tax,
    total: data.total,
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
    paymentId: data.paymentId,
    notes: data.notes,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    orderItems: data.orderItems || [],
  };
};

// Auth API
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(credential.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      const userDoc = doc(db, 'users', credential.user.uid);
      const userPayload: User = {
        id: credential.user.uid,
        email: credential.user.email || data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDoc, {
        ...userPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const token = await getIdToken(credential.user, true);

      return withSuccess({ user: userPayload, token });
    } catch (error: any) {
      return withError(error.message || 'Registration failed');
    }
  },
  login: async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'users', credential.user.uid);
      const snapshot = await getDoc(docRef);
      const userData = snapshot.data();

      const user: User = {
        id: credential.user.uid,
        email: credential.user.email || email,
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        phone: userData?.phone,
        role: userData?.role || 'CUSTOMER',
        createdAt: userData?.createdAt?.toDate?.()?.toISOString?.(),
      };

      const token = await getIdToken(credential.user, true);
      return withSuccess({ user, token });
    } catch (error: any) {
      return withError(error.message || 'Login failed');
    }
  },
  logout: async () => {
    await signOut(auth);
    return withSuccess({});
  },
  getMe: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return withError('Not authenticated');
    }
    const docRef = doc(db, 'users', currentUser.uid);
    const snapshot = await getDoc(docRef);
    const data = snapshot.data();
    if (!data) {
      return withError('User profile not found');
    }
    const user: User = {
      id: currentUser.uid,
      email: currentUser.email || '',
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || 'CUSTOMER',
      createdAt: data.createdAt?.toDate?.()?.toISOString?.(),
    };
    const token = await getIdToken(currentUser, true);
    return withSuccess({ user, token });
  },
  updateProfile: async (data: { firstName?: string; lastName?: string; phone?: string }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return withError('Not authenticated');
    }
    const docRef = doc(db, 'users', currentUser.uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    const snapshot = await getDoc(docRef);
    const updated = snapshot.data();
    const user: User = {
      id: currentUser.uid,
      email: currentUser.email || '',
      firstName: updated?.firstName || '',
      lastName: updated?.lastName || '',
      phone: updated?.phone,
      role: updated?.role || 'CUSTOMER',
      createdAt: updated?.createdAt?.toDate?.()?.toISOString?.(),
    };
    return withSuccess({ user });
  },
};

// Products API
export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    let q = collection(db, 'products');
    const constraints = [];

    if (params?.category) constraints.push(where('category', '==', params.category));
    if (params?.brand) constraints.push(where('brand', '==', params.brand));
    if (params?.featured) constraints.push(where('isFeatured', '==', true));
    if (params?.search) constraints.push(where('keywords', 'array-contains', params.search.toLowerCase()));

    if (params?.sortBy) {
      constraints.push(orderBy(params.sortBy, params.sortOrder || 'desc'));
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    constraints.push(limit(params?.limit || 20));

    const snapshot = await getDocs(query(q, ...constraints));
    const products = snapshot.docs.map(mapProduct);

    return withSuccess({
      products,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || products.length,
        total: products.length,
        pages: 1,
      } as Pagination,
    });
  },
  getById: async (id: string) => {
    const docRef = doc(db, 'products', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return withError('Product not found');
    }
    return withSuccess({ product: mapProduct(snapshot) });
  },
  getFeatured: async () => {
    const snapshot = await getDocs(
      query(collection(db, 'products'), where('isFeatured', '==', true), limit(8))
    );
    return withSuccess({ products: snapshot.docs.map(mapProduct) });
  },
  getByCategory: async (category: string, params?: { page?: number; limit?: number }) => {
    const snapshot = await getDocs(
      query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(params?.limit || 20)
      )
    );
    const products = snapshot.docs.map(mapProduct);
    return withSuccess({
      products,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || products.length,
        total: products.length,
        pages: 1,
      },
    });
  },
  // Admin
  create: async (data: Partial<Product>) => {
    const docRef = await addDoc(collection(db, 'products'), {
      ...data,
      images: data.images || [],
      isFeatured: data.isFeatured ?? false,
      isActive: data.isActive ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      keywords: data.name
        ? [
            ...new Set(
              data.name
                .toLowerCase()
                .split(' ')
                .filter(Boolean)
            ),
          ]
        : [],
    });
    const snapshot = await getDoc(docRef);
    return withSuccess({ product: mapProduct(snapshot) });
  },
  update: async (id: string, data: Partial<Product>) => {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    const snapshot = await getDoc(docRef);
    return withSuccess({ product: mapProduct(snapshot) });
  },
  delete: async (id: string) => {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return withSuccess({});
  },
};

// Orders API
export const ordersApi = {
  create: async (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
    notes?: string;
  }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return withError('Authentication required');

    const productDocs = await Promise.all(
      data.items.map((item) => getDoc(doc(db, 'products', item.productId)))
    );

    let subtotal = 0;
    const orderItems = productDocs.map((snapshot, index) => {
      const product = mapProduct(snapshot);
      const quantity = data.items[index].quantity;
      subtotal += product.price * quantity;
      return {
        productId: product.id,
        product,
        quantity,
        priceAtPurchase: product.price,
      };
    });

    const shippingCost = subtotal >= 500 ? 0 : 50;
    const tax = subtotal * 0.15;
    const total = subtotal + shippingCost + tax;

    const orderPayload = {
      orderNumber: `ORD-${Date.now()}`,
      userId: currentUser.uid,
      user: {
        id: currentUser.uid,
        email: currentUser.email,
      },
      status: 'PENDING',
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress || data.shippingAddress,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'PENDING',
      notes: data.notes,
      orderItems,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'orders'), orderPayload);
    const snapshot = await getDoc(docRef);
    return withSuccess({ order: mapOrder(snapshot) });
  },
  getMyOrders: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return withError('Authentication required');

    const snapshot = await getDocs(
      query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      )
    );
    return withSuccess({ orders: snapshot.docs.map(mapOrder) });
  },
  getById: async (id: string) => {
    const docRef = doc(db, 'orders', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return withError('Order not found');
    return withSuccess({ order: mapOrder(snapshot) });
  },
  cancel: async (id: string) => {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status: 'CANCELLED', updatedAt: serverTimestamp() });
    return withSuccess({});
  },
  // Admin
  getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
    const constraints = [];
    if (params?.status) constraints.push(where('status', '==', params.status));
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(params?.limit || 20));

    const snapshot = await getDocs(query(collection(db, 'orders'), ...constraints));
    const orders = snapshot.docs.map(mapOrder);
    return withSuccess({
      orders,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || orders.length,
        total: orders.length,
        pages: 1,
      },
    });
  },
  updateStatus: async (id: string, status: string) => {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    const snapshot = await getDoc(docRef);
    return withSuccess({ order: mapOrder(snapshot) });
  },
};

// Payment API
export const paymentApi = {
  initiate: async () => {
    return withError(
      'PayFast integration requires a Firebase Cloud Function. Please configure a callable function to initiate payments.'
    );
  },
};

// Users API (Admin)
export const usersApi = {
  getAll: async (params?: { page?: number; limit?: number; role?: string; search?: string }) => {
    const constraints = [];
    if (params?.role) constraints.push(where('role', '==', params.role));
    const snapshot = await getDocs(query(collection(db, 'users'), ...constraints));
    const users = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      const user: User = {
        id: docSnapshot.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role || 'CUSTOMER',
        createdAt: data.createdAt?.toDate?.()?.toISOString?.(),
      };
      return user;
    });
    return withSuccess({
      users,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || users.length,
        total: users.length,
        pages: 1,
      },
    });
  },
  getById: async (id: string) => {
    const docRef = doc(db, 'users', id);
    const snapshot = await getDoc(docRef);
    const data = snapshot.data();
    if (!data) return withError('User not found');
    const user: User = {
      id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || 'CUSTOMER',
      createdAt: data.createdAt?.toDate?.()?.toISOString?.(),
    };
    return withSuccess({ user });
  },
  update: async (id: string, data: Partial<User>) => {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    const snapshot = await getDoc(docRef);
    const userData = snapshot.data();
    if (!userData) return withError('User not found');
    const user: User = {
      id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role || 'CUSTOMER',
      createdAt: userData.createdAt?.toDate?.()?.toISOString?.(),
    };
    return withSuccess({ user });
  },
  delete: async (id: string) => {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
    return withSuccess({});
  },
  getDashboardStats: async () => {
    const [ordersSnapshot, productsSnapshot, usersSnapshot] = await Promise.all([
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'users')),
    ]);

    const totalRevenue = ordersSnapshot.docs.reduce((sum, docSnap) => {
      const data = docSnap.data();
      if (data.paymentStatus === 'PAID') {
        return sum + (data.total || 0);
      }
      return sum;
    }, 0);

    return withSuccess({
      stats: {
        totalRevenue,
        totalOrders: ordersSnapshot.size,
        totalProducts: productsSnapshot.size,
        totalUsers: usersSnapshot.size,
      },
      recentOrders: ordersSnapshot.docs
        .slice(0, 10)
        .map(mapOrder)
        .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')),
      topProducts: [],
    });
  },
};
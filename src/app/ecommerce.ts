import { computed, inject } from '@angular/core';
import { Product } from './models/products';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { produce } from 'immer';
import { ToasterService } from './services/toaster.service';
import { CartItem } from './models/cart';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { SignInParams, SignUpParams, User } from './models/user';
import { Router, RouterLink } from '@angular/router';
import { Order } from './models/order';
import { withStorageSync } from '@angular-architects/ngrx-toolkit';

export type EcommerceState = {
  products: Product[];
  category: string;
  searchQuery: string;
  wishlistItems: Product[];
  cartItems: CartItem[];
  user: User | undefined;
  loading: boolean;
  minPrice: number;
  maxPrice: number;
  minRating: number | null;
  sort: string; // 'price_asc' | 'price_desc' | 'name_asc' | 'newest'

  selectedProductId: string | undefined;
  isSidebarOpen: boolean;
};

export const EcommerceStore = signalStore(
  {
    providedIn: 'root',
  },
  withState({
    products: [],
    category: 'all',
    searchQuery: '',
    wishlistItems: [],
    minRating: null,
    cartItems: [],
    user: undefined,
    loading: false,
    minPrice: 0,
    maxPrice: 5000,
    sort: 'newest',
    selectedProductId: undefined,
    isSidebarOpen: true,
  } as EcommerceState),
  withStorageSync({
    key: 'modern-store',
    select: ({ wishlistItems, cartItems, user }) => ({ wishlistItems, cartItems, user }),
  }),

  withComputed(
    ({
      category,
      products,
      searchQuery,
      wishlistItems,
      cartItems,
      selectedProductId,
      minPrice,
      maxPrice,
      minRating,
    }) => ({
      filteredProducts: computed(() => {
        let filtered = products();

        // Filter by category
        if (category() !== 'all') {
          filtered = filtered.filter((p) => p.category === category().toLowerCase());
        }

        // Filter by search query
        const query = searchQuery().toLowerCase().trim();
        if (query) {
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query) ||
              p.category.toLowerCase().includes(query)
          );
        }

        // Filter by price range
        filtered = filtered.filter((p) => p.price >= minPrice() && p.price <= maxPrice());

        // Filter by rating
        if (minRating() !== null) {
          filtered = filtered.filter((p) => (p.rating || 0) >= minRating()!);
        }

        return filtered;
      }),
      wishlistCount: computed(() => wishlistItems().length),
      cartCount: computed(() => cartItems().reduce((acc, item) => acc + item.quantity, 0)),
      selectedProduct: computed(() => products().find((p) => p.id === selectedProductId())),
    })
  ),

  withMethods(
    (
      store,
      toaster = inject(ToasterService),
      matDialog = inject(MatDialog),
      router = inject(Router),
      apiService = inject(ApiService)
    ) => ({
      loadProducts: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() => {
            const params = {
              category: store.category(),
              minPrice: store.minPrice(),
              maxPrice: store.maxPrice(),
              sort: store.sort(),
            };
            return apiService.getProducts(params).pipe(
              tap({
                next: (products) => patchState(store, { products, loading: false }),
                error: (err) => {
                  console.error('Failed to load products', err);
                  patchState(store, { loading: false });
                  toaster.error('Failed to connect to backend');
                },
              })
            );
          })
        )
      ),
    })
  ),
  withMethods(
    (
      store,
      toaster = inject(ToasterService),
      matDialog = inject(MatDialog),
      router = inject(Router),
      apiService = inject(ApiService),
      authService = inject(AuthService)
    ) => ({
      updateFilter: signalMethod<{ minPrice: number; maxPrice: number; sort: string }>((filter) => {
        patchState(store, { ...filter });
        store.loadProducts(); // Now loadProducts should be available from previous withMethods
      }),
      setCategory: signalMethod<string>((category: string) => {
        patchState(store, { category });
        store.loadProducts();
      }),

      setSearchQuery: signalMethod<string>((searchQuery: string) => {
        patchState(store, { searchQuery });
      }),

      setMinRating: signalMethod<number | null>((minRating: number | null) => {
        patchState(store, { minRating });
      }),

      setProductId: signalMethod<string>((productId: string) => {
        patchState(store, { selectedProductId: productId });
      }),

      toggleSidebar: () => {
        patchState(store, { isSidebarOpen: !store.isSidebarOpen() });
      },

      addToWishlish(product: Product) {
        const updatedWishlistItems = produce(store.wishlistItems(), (draft) => {
          if (!draft.find((p) => p.id === product.id)) {
            draft.push(product);
          }
        });

        patchState(store, { wishlistItems: updatedWishlistItems });
        toaster.success('Product added to wishlish');
      },

      removeFromWishlist: (product: Product) => {
        patchState(store, {
          wishlistItems: store.wishlistItems().filter((p) => p.id !== product.id),
        });
        toaster.success('Product removed from wishlist');
      },

      addToCart: (product: Product, quantity = 1) => {
        const existingItemIndex = store.cartItems().findIndex((i) => i.product.id === product.id);

        const updatedCartItems = produce(store.cartItems(), (draft) => {
          if (existingItemIndex !== -1) {
            draft[existingItemIndex].quantity += quantity;
            return;
          }
          draft.push({
            product,
            quantity,
          });
        });
        const updatedWishlistItems = store.wishlistItems().filter((p) => p.id !== product.id);

        patchState(store, {
          cartItems: updatedCartItems,
          wishlistItems: updatedWishlistItems, // Clear from wishlist
        });

        toaster.success(
          existingItemIndex !== -1 ? 'Product quantity increased' : 'Product moved to cart'
        );
      },

      setItemQuantity(params: { productId: string; quantity: number }) {
        const cartItems = store.cartItems();
        const index = cartItems.findIndex((i) => i.product.id === params.productId);
        if (index === -1 || params.quantity < 0) return; // Guard clause

        const updated = produce(cartItems, (draft) => {
          draft[index].quantity = params.quantity;
        });
        patchState(store, { cartItems: updated });
      },

      addAllWishlistToCart: () => {
        const updatedCartItems = produce(store.cartItems(), (draft) => {
          store.wishlistItems().forEach((p) => {
            if (!draft.find((i) => i.product.id === p.id)) {
              draft.push({ product: p, quantity: 1 } as CartItem);
            }
          });
        });
        patchState(store, { cartItems: updatedCartItems, wishlistItems: [] });
      },

      moveToWishlist: (product: Product) => {
        const updatedCartItems = store.cartItems().filter((p) => p.product.id !== product.id);
        const updatedWishlistItems = produce(store.wishlistItems(), (draft) => {
          if (!draft.find((i) => i.id === product.id)) {
            draft.push(product);
          }
        });
        patchState(store, { cartItems: updatedCartItems, wishlistItems: updatedWishlistItems });
      },
      removeFromCart: (product: Product) => {
        patchState(store, {
          cartItems: store.cartItems().filter((p) => p.product.id !== product.id),
        });
      },

      proceedToCheckout: () => {
        // Use AuthService instead of store.user()
        if (!authService.isAuthenticated) {
          matDialog.open(AuthDialogComponent, {
            width: '500px',
            disableClose: false,
          });
          return;
        }
        router.navigate(['/checkout']);
      },

      signUp({ email, password, name, dialogId }: SignUpParams) {
        const usersStr = localStorage.getItem('app_users');
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];

        if (users.find((u) => u.email === email)) {
          toaster.error('User already exists');
          return;
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
          imageUrl: 'https://i.pravatar.cc/150?u=' + email, // Dynamic avatar
        };

        // In a real app, we would hash the password. storing plain text for demo.
        const usersWithPassword = [
          ...(usersStr ? JSON.parse(usersStr) : []),
          { ...newUser, password },
        ];
        localStorage.setItem('app_users', JSON.stringify(usersWithPassword));

        patchState(store, { user: newUser });
        matDialog.getDialogById(dialogId)?.close();
        toaster.success('Account created successfully');
      },

      signIn({ email, password, checkout, dialogId }: SignInParams) {
        const usersStr = localStorage.getItem('app_users');
        const users: any[] = usersStr ? JSON.parse(usersStr) : [];

        const foundUser = users.find((u) => u.email === email && u.password === password);

        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          patchState(store, {
            user: userWithoutPassword,
          });

          matDialog.getDialogById(dialogId)?.close();

          if (checkout) {
            router.navigate(['/checkout']);
          }
          toaster.success('Signed in successfully');
        } else {
          toaster.error('Invalid email or password');
        }
      },

      placeOrder: () => {
        patchState(store, { loading: true });

        const user = authService.currentUser;
        if (!user) {
          toaster.error('Please login before placing order');
          patchState(store, { loading: false });
          return;
        }

        const orderData = {
          customerName: user.name,
          customerEmail: user.email,
          items: store.cartItems().map((i) => ({
            productId: Number(i.product.id),
            quantity: i.quantity,
          })),
        };

        apiService.createOrder(orderData).subscribe({
          next: () => {
            patchState(store, { loading: false, cartItems: [] });
            router.navigate(['order-success']);
          },
          error: (err) => {
            console.error(err);
            patchState(store, { loading: false });
            toaster.error('Failed to place order');
          },
        });
      },

      signOut: () => {
        patchState(store, { user: undefined });
      },

      submitReview: rxMethod<{
        productId: string;
        title: string;
        rating: number;
        comment: string;
      }>(
        pipe(
          switchMap((params) => {
            const user = authService.currentUser;
            if (!user) {
              toaster.error('Please sign in to submit a review');
              return [];
            }

            // Call Backend API first
            return apiService
              .submitReview({
                userName: user.name,
                userImageUrl: user.imageUrl || '',
                rating: params.rating,
                comment: params.comment,
                title: params.title,
                productId: Number(params.productId),
              })
              .pipe(
                switchMap(() => {
                  // After successful submission, reload the specific product from server
                  return apiService.getProductById(params.productId).pipe(
                    tap((updatedProduct) => {
                      // Update the product in the products array
                      const products = store.products();
                      const productIndex = products.findIndex((p) => p.id === params.productId);

                      if (productIndex !== -1) {
                        const updatedProducts = produce(products, (draft) => {
                          draft[productIndex] = updatedProduct;
                        });
                        patchState(store, { products: updatedProducts });
                      }

                      toaster.success('Review submitted successfully');
                    })
                  );
                }),
                tap({
                  error: (err) => {
                    console.error('Failed to submit review', err);
                    toaster.error('Failed to save review to server');
                  },
                })
              );
          })
        )
      ),
    })
  ),
  withHooks({
    onInit(store) {
      store.loadProducts();
    },
  })
);

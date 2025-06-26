# Frontend Geliştirme

Bu doküman, Codifya ERP sisteminin frontend geliştirme standartlarını ve best practice'lerini detaylandırır.

## React Uygulaması

### Proje Yapısı

```
src/
├── assets/           # Statik dosyalar
├── components/       # Yeniden kullanılabilir bileşenler
├── config/          # Yapılandırma dosyaları
├── hooks/           # Custom hooks
├── layouts/         # Sayfa düzenleri
├── pages/           # Sayfa bileşenleri
├── services/        # API servisleri
├── store/           # Redux store
├── styles/          # Global stiller
├── types/           # TypeScript tipleri
└── utils/           # Yardımcı fonksiyonlar
```

### Component Yapısı

1. **Atomic Design**
   ```typescript
   // atoms/Button.tsx
   interface ButtonProps {
     variant: 'primary' | 'secondary' | 'danger';
     size: 'small' | 'medium' | 'large';
     children: React.ReactNode;
     onClick?: () => void;
   }

   const Button: React.FC<ButtonProps> = ({
     variant,
     size,
     children,
     onClick
   }) => {
     return (
       <button
         className={`btn btn-${variant} btn-${size}`}
         onClick={onClick}
       >
         {children}
       </button>
     );
   };

   // molecules/UserCard.tsx
   interface UserCardProps {
     user: User;
     onEdit: (user: User) => void;
     onDelete: (userId: string) => void;
   }

   const UserCard: React.FC<UserCardProps> = ({
     user,
     onEdit,
     onDelete
   }) => {
     return (
       <div className="user-card">
         <Avatar src={user.avatar} />
         <UserInfo user={user} />
         <ButtonGroup>
           <Button variant="primary" onClick={() => onEdit(user)}>
             Düzenle
           </Button>
           <Button variant="danger" onClick={() => onDelete(user.id)}>
             Sil
           </Button>
         </ButtonGroup>
       </div>
     );
   };
   ```

2. **Container Pattern**
   ```typescript
   // containers/UserListContainer.tsx
   const UserListContainer: React.FC = () => {
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<Error | null>(null);

     useEffect(() => {
       const fetchUsers = async () => {
         try {
           const data = await userService.getUsers();
           setUsers(data);
         } catch (err) {
           setError(err as Error);
         } finally {
           setLoading(false);
         }
       };

       fetchUsers();
     }, []);

     if (loading) return <Spinner />;
     if (error) return <ErrorMessage error={error} />;

     return <UserList users={users} />;
   };
   ```

### State Yönetimi

1. **Redux Toolkit**
   ```typescript
   // store/slices/userSlice.ts
   const userSlice = createSlice({
     name: 'user',
     initialState,
     reducers: {
       setUser: (state, action) => {
         state.currentUser = action.payload;
       },
       clearUser: (state) => {
         state.currentUser = null;
       }
     }
   });

   // store/index.ts
   const store = configureStore({
     reducer: {
       user: userSlice.reducer,
       auth: authSlice.reducer,
       ui: uiSlice.reducer
     },
     middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware().concat(logger)
   });
   ```

2. **Context API**
   ```typescript
   // contexts/ThemeContext.tsx
   const ThemeContext = createContext<ThemeContextType | null>(null);

   const ThemeProvider: React.FC = ({ children }) => {
     const [theme, setTheme] = useState<'light' | 'dark'>('light');

     const toggleTheme = () => {
       setTheme(prev => prev === 'light' ? 'dark' : 'light');
     };

     return (
       <ThemeContext.Provider value={{ theme, toggleTheme }}>
         {children}
       </ThemeContext.Provider>
     );
   };

   // hooks/useTheme.ts
   const useTheme = () => {
     const context = useContext(ThemeContext);
     if (!context) {
       throw new Error('useTheme must be used within ThemeProvider');
     }
     return context;
   };
   ```

### Routing

1. **React Router**
   ```typescript
   // routes/index.tsx
   const AppRoutes: React.FC = () => {
     return (
       <Routes>
         <Route path="/" element={<Layout />}>
           <Route index element={<Dashboard />} />
           <Route path="users" element={<UserList />} />
           <Route path="users/:id" element={<UserDetail />} />
           <Route path="settings" element={<Settings />} />
           <Route path="*" element={<NotFound />} />
         </Route>
       </Routes>
     );
   };

   // components/PrivateRoute.tsx
   const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
     children
   }) => {
     const { isAuthenticated } = useAuth();
     const location = useLocation();

     if (!isAuthenticated) {
       return <Navigate to="/login" state={{ from: location }} replace />;
     }

     return <>{children}</>;
   };
   ```

### Form Yönetimi

1. **React Hook Form**
   ```typescript
   // components/UserForm.tsx
   const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData }) => {
     const {
       register,
       handleSubmit,
       formState: { errors }
     } = useForm<UserFormData>({
       defaultValues: initialData
     });

     return (
       <form onSubmit={handleSubmit(onSubmit)}>
         <FormField
           label="Ad"
           error={errors.firstName?.message}
         >
           <input
             {...register('firstName', {
               required: 'Ad alanı zorunludur'
             })}
           />
         </FormField>

         <FormField
           label="Soyad"
           error={errors.lastName?.message}
         >
           <input
             {...register('lastName', {
               required: 'Soyad alanı zorunludur'
             })}
           />
         </FormField>

         <Button type="submit">Kaydet</Button>
       </form>
     );
   };
   ```

2. **Form Validasyonu**
   ```typescript
   // utils/validation.ts
   const userSchema = yup.object().shape({
     firstName: yup
       .string()
       .required('Ad alanı zorunludur')
       .min(2, 'Ad en az 2 karakter olmalıdır'),
     lastName: yup
       .string()
       .required('Soyad alanı zorunludur')
       .min(2, 'Soyad en az 2 karakter olmalıdır'),
     email: yup
       .string()
       .required('E-posta alanı zorunludur')
       .email('Geçerli bir e-posta adresi giriniz'),
     password: yup
       .string()
       .required('Şifre alanı zorunludur')
       .min(8, 'Şifre en az 8 karakter olmalıdır')
   });
   ```

### API İstekleri

1. **Axios Instance**
   ```typescript
   // services/api.ts
   const api = axios.create({
     baseURL: process.env.REACT_APP_API_URL,
     timeout: 10000,
     headers: {
       'Content-Type': 'application/json'
     }
   });

   api.interceptors.request.use(
     (config) => {
       const token = localStorage.getItem('token');
       if (token) {
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     },
     (error) => {
       return Promise.reject(error);
     }
   );

   api.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response?.status === 401) {
         // Token yenileme veya logout
       }
       return Promise.reject(error);
     }
   );
   ```

2. **Custom Hook**
   ```typescript
   // hooks/useApi.ts
   const useApi = <T>(url: string) => {
     const [data, setData] = useState<T | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<Error | null>(null);

     useEffect(() => {
       const fetchData = async () => {
         try {
           const response = await api.get<T>(url);
           setData(response.data);
         } catch (err) {
           setError(err as Error);
         } finally {
           setLoading(false);
         }
       };

       fetchData();
     }, [url]);

     return { data, loading, error };
   };
   ```

### Styling

1. **CSS Modules**
   ```css
   /* UserCard.module.css */
   .card {
     padding: 1rem;
     border-radius: 4px;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }

   .header {
     display: flex;
     align-items: center;
     margin-bottom: 1rem;
   }

   .avatar {
     width: 48px;
     height: 48px;
     border-radius: 50%;
   }

   .info {
     margin-left: 1rem;
   }

   .name {
     font-size: 1.2rem;
     font-weight: 600;
   }

   .email {
     color: #666;
   }
   ```

2. **Styled Components**
   ```typescript
   // components/styled/Button.ts
   const StyledButton = styled.button<ButtonProps>`
     padding: ${props => props.size === 'large' ? '1rem 2rem' : '0.5rem 1rem'};
     border-radius: 4px;
     border: none;
     background-color: ${props => {
       switch (props.variant) {
         case 'primary':
           return '#007bff';
         case 'secondary':
           return '#6c757d';
         case 'danger':
           return '#dc3545';
         default:
           return '#007bff';
       }
     }};
     color: white;
     font-size: ${props => props.size === 'large' ? '1.2rem' : '1rem'};
     cursor: pointer;
     transition: background-color 0.2s;

     &:hover {
       background-color: ${props => {
         switch (props.variant) {
           case 'primary':
             return '#0056b3';
           case 'secondary':
             return '#545b62';
           case 'danger':
             return '#c82333';
           default:
             return '#0056b3';
         }
       }};
     }
   `;
   ```

### Testing

1. **Unit Tests**
   ```typescript
   // components/__tests__/Button.test.tsx
   describe('Button', () => {
     it('renders correctly', () => {
       render(<Button variant="primary">Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });

     it('calls onClick when clicked', () => {
       const handleClick = jest.fn();
       render(
         <Button variant="primary" onClick={handleClick}>
           Click me
         </Button>
       );
       fireEvent.click(screen.getByText('Click me'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });
   });
   ```

2. **Integration Tests**
   ```typescript
   // components/__tests__/UserForm.test.tsx
   describe('UserForm', () => {
     it('submits form data correctly', async () => {
       const handleSubmit = jest.fn();
       render(<UserForm onSubmit={handleSubmit} />);

       fireEvent.change(screen.getByLabelText('Ad'), {
         target: { value: 'John' }
       });
       fireEvent.change(screen.getByLabelText('Soyad'), {
         target: { value: 'Doe' }
       });
       fireEvent.change(screen.getByLabelText('E-posta'), {
         target: { value: 'john@example.com' }
       });

       fireEvent.click(screen.getByText('Kaydet'));

       await waitFor(() => {
         expect(handleSubmit).toHaveBeenCalledWith({
           firstName: 'John',
           lastName: 'Doe',
           email: 'john@example.com'
         });
       });
     });
   });
   ```

### Performance Optimizasyonu

1. **Code Splitting**
   ```typescript
   // App.tsx
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   const UserList = lazy(() => import('./pages/UserList'));
   const Settings = lazy(() => import('./pages/Settings'));

   const App: React.FC = () => {
     return (
       <Suspense fallback={<Spinner />}>
         <Routes>
           <Route path="/" element={<Dashboard />} />
           <Route path="/users" element={<UserList />} />
           <Route path="/settings" element={<Settings />} />
         </Routes>
       </Suspense>
     );
   };
   ```

2. **Memoization**
   ```typescript
   // components/UserList.tsx
   const UserList: React.FC = () => {
     const users = useSelector(selectUsers);
     const dispatch = useDispatch();

     const handleDelete = useCallback((userId: string) => {
       dispatch(deleteUser(userId));
     }, [dispatch]);

     const filteredUsers = useMemo(() => {
       return users.filter(user => user.isActive);
     }, [users]);

     return (
       <div>
         {filteredUsers.map(user => (
           <UserCard
             key={user.id}
             user={user}
             onDelete={handleDelete}
           />
         ))}
       </div>
     );
   };
   ```

### Error Handling

1. **Error Boundary**
   ```typescript
   // components/ErrorBoundary.tsx
   class ErrorBoundary extends React.Component<
     { children: React.ReactNode },
     { hasError: boolean; error: Error | null }
   > {
     constructor(props: { children: React.ReactNode }) {
       super(props);
       this.state = { hasError: false, error: null };
     }

     static getDerivedStateFromError(error: Error) {
       return { hasError: true, error };
     }

     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
       console.error('Error:', error);
       console.error('Error Info:', errorInfo);
     }

     render() {
       if (this.state.hasError) {
         return (
           <div className="error-boundary">
             <h1>Bir şeyler yanlış gitti</h1>
             <p>{this.state.error?.message}</p>
             <Button onClick={() => window.location.reload()}>
               Sayfayı Yenile
             </Button>
           </div>
         );
       }

       return this.props.children;
     }
   }
   ```

2. **Global Error Handler**
   ```typescript
   // utils/errorHandler.ts
   const errorHandler = (error: Error) => {
     console.error('Error:', error);

     if (error instanceof NetworkError) {
       toast.error('İnternet bağlantınızı kontrol edin');
     } else if (error instanceof ValidationError) {
       toast.error(error.message);
     } else {
       toast.error('Beklenmeyen bir hata oluştu');
     }
   };

   window.addEventListener('unhandledrejection', (event) => {
     errorHandler(event.reason);
   });
   ``` 
# Kod Standartları

Bu doküman, Codifya ERP projesinin kod yazım standartlarını ve best practice'lerini detaylandırır.

## TypeScript Standartları

### Genel Kurallar

1. **Strict Mode**
   ```typescript
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "alwaysStrict": true
     }
   }
   ```

2. **Interface Kullanımı**
   ```typescript
   // Doğru kullanım
   interface User {
     id: string;
     name: string;
     email: string;
     role: UserRole;
   }

   // Yanlış kullanım
   type User = {
     id: string;
     name: string;
     email: string;
     role: UserRole;
   }
   ```

3. **Type Assertion**
   ```typescript
   // Doğru kullanım
   const user = getUser() as User;

   // Yanlış kullanım
   const user = <User>getUser();
   ```

4. **Generic Kullanımı**
   ```typescript
   // Doğru kullanım
   interface Repository<T> {
     findById(id: string): Promise<T>;
     save(entity: T): Promise<T>;
     delete(id: string): Promise<void>;
   }

   // Yanlış kullanım
   interface Repository {
     findById(id: string): Promise<any>;
     save(entity: any): Promise<any>;
     delete(id: string): Promise<void>;
   }
   ```

### Naming Conventions

1. **Değişkenler**
   ```typescript
   // Doğru kullanım
   const userName = 'John';
   const isActive = true;
   const userList = [];

   // Yanlış kullanım
   const UserName = 'John';
   const is_active = true;
   const user_list = [];
   ```

2. **Fonksiyonlar**
   ```typescript
   // Doğru kullanım
   function getUserById(id: string): Promise<User> {
     // ...
   }

   // Yanlış kullanım
   function GetUserById(id: string): Promise<User> {
     // ...
   }
   ```

3. **Sınıflar**
   ```typescript
   // Doğru kullanım
   class UserService {
     // ...
   }

   // Yanlış kullanım
   class userService {
     // ...
   }
   ```

4. **Interface'ler**
   ```typescript
   // Doğru kullanım
   interface IUserService {
     // ...
   }

   // Yanlış kullanım
   interface userService {
     // ...
   }
   ```

## JavaScript Standartları

### ES6+ Özellikleri

1. **Arrow Functions**
   ```javascript
   // Doğru kullanım
   const getUser = async (id) => {
     const user = await userRepository.findById(id);
     return user;
   };

   // Yanlış kullanım
   function getUser(id) {
     return userRepository.findById(id).then(user => {
       return user;
     });
   }
   ```

2. **Destructuring**
   ```javascript
   // Doğru kullanım
   const { id, name, email } = user;

   // Yanlış kullanım
   const id = user.id;
   const name = user.name;
   const email = user.email;
   ```

3. **Spread Operator**
   ```javascript
   // Doğru kullanım
   const newUser = { ...user, role: 'admin' };

   // Yanlış kullanım
   const newUser = Object.assign({}, user, { role: 'admin' });
   ```

4. **Template Literals**
   ```javascript
   // Doğru kullanım
   const message = `Hello ${user.name}!`;

   // Yanlış kullanım
   const message = 'Hello ' + user.name + '!';
   ```

### Async/Await

1. **Promise Kullanımı**
   ```javascript
   // Doğru kullanım
   async function getUsers() {
     try {
       const users = await userRepository.findAll();
       return users;
     } catch (error) {
       throw new Error('Failed to get users');
     }
   }

   // Yanlış kullanım
   function getUsers() {
     return userRepository.findAll()
       .then(users => users)
       .catch(error => {
         throw new Error('Failed to get users');
       });
   }
   ```

2. **Error Handling**
   ```javascript
   // Doğru kullanım
   try {
     await saveUser(user);
   } catch (error) {
     logger.error('Failed to save user', error);
     throw new AppError('USER_SAVE_FAILED');
   }

   // Yanlış kullanım
   saveUser(user).catch(error => {
     console.log(error);
   });
   ```

## React Standartları

### Component Yapısı

1. **Functional Components**
   ```typescript
   // Doğru kullanım
   const UserCard: React.FC<UserCardProps> = ({ user }) => {
     return (
       <div className="user-card">
         <h2>{user.name}</h2>
         <p>{user.email}</p>
       </div>
     );
   };

   // Yanlış kullanım
   class UserCard extends React.Component<UserCardProps> {
     render() {
       return (
         <div className="user-card">
           <h2>{this.props.user.name}</h2>
           <p>{this.props.user.email}</p>
         </div>
       );
     }
   }
   ```

2. **Hooks Kullanımı**
   ```typescript
   // Doğru kullanım
   const UserList: React.FC = () => {
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const fetchUsers = async () => {
         try {
           const data = await userService.getUsers();
           setUsers(data);
         } finally {
           setLoading(false);
         }
       };

       fetchUsers();
     }, []);

     return (
       <div>
         {loading ? (
           <Spinner />
         ) : (
           users.map(user => <UserCard key={user.id} user={user} />)
         )}
       </div>
     );
   };
   ```

### State Yönetimi

1. **Redux Kullanımı**
   ```typescript
   // Doğru kullanım
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

   // Yanlış kullanım
   const userReducer = (state = initialState, action) => {
     switch (action.type) {
       case 'SET_USER':
         return { ...state, currentUser: action.payload };
       case 'CLEAR_USER':
         return { ...state, currentUser: null };
       default:
         return state;
     }
   };
   ```

2. **Context API Kullanımı**
   ```typescript
   // Doğru kullanım
   const UserContext = createContext<UserContextType | null>(null);

   const UserProvider: React.FC = ({ children }) => {
     const [user, setUser] = useState<User | null>(null);

     const value = {
       user,
       setUser,
       isAuthenticated: !!user
     };

     return (
       <UserContext.Provider value={value}>
         {children}
       </UserContext.Provider>
     );
   };
   ```

## Styling Standartları

### CSS Modules

1. **Component Styling**
   ```typescript
   // styles.module.css
   .card {
     padding: 1rem;
     border-radius: 4px;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }

   // Component.tsx
   import styles from './styles.module.css';

   const Card: React.FC = ({ children }) => (
     <div className={styles.card}>
       {children}
     </div>
   );
   ```

2. **Responsive Design**
   ```css
   /* Doğru kullanım */
   .container {
     width: 100%;
     max-width: 1200px;
     margin: 0 auto;
     padding: 0 1rem;
   }

   @media (max-width: 768px) {
     .container {
       padding: 0 0.5rem;
     }
   }
   ```

## Test Standartları

### Unit Tests

1. **Jest Kullanımı**
   ```typescript
   // Doğru kullanım
   describe('UserService', () => {
     it('should return user by id', async () => {
       const user = await userService.getUserById('123');
       expect(user).toBeDefined();
       expect(user.id).toBe('123');
     });

     it('should throw error when user not found', async () => {
       await expect(userService.getUserById('999')).rejects.toThrow();
     });
   });
   ```

2. **React Testing Library**
   ```typescript
   // Doğru kullanım
   describe('UserCard', () => {
     it('should render user information', () => {
       const user = { id: '1', name: 'John', email: 'john@example.com' };
       render(<UserCard user={user} />);

       expect(screen.getByText('John')).toBeInTheDocument();
       expect(screen.getByText('john@example.com')).toBeInTheDocument();
     });
   });
   ```

## Dokümantasyon Standartları

### JSDoc

1. **Fonksiyon Dokümantasyonu**
   ```typescript
   /**
    * Kullanıcı bilgilerini getirir
    * @param {string} id - Kullanıcı ID'si
    * @returns {Promise<User>} Kullanıcı bilgileri
    * @throws {AppError} Kullanıcı bulunamadığında
    */
   async function getUserById(id: string): Promise<User> {
     // ...
   }
   ```

2. **Interface Dokümantasyonu**
   ```typescript
   /**
    * Kullanıcı servisi interface'i
    * @interface IUserService
    */
   interface IUserService {
     /**
      * Kullanıcı bilgilerini getirir
      * @param {string} id - Kullanıcı ID'si
      * @returns {Promise<User>} Kullanıcı bilgileri
      */
     getUserById(id: string): Promise<User>;
   }
   ``` 
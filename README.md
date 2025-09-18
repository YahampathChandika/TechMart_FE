# TechMart Frontend (Next.js)

A modern, responsive e-commerce frontend built with Next.js

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YahampathChandika/TechMart_FE.git
   cd TechMart_FE
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Application will be available at `http://localhost:3000`

## 🔑 Default Login Credentials

**Admin Dashboard:**
- Email: `admin@techmart.com`
- Password: `password123`

**Customer Login:**
- Email: `customer@techmart.com`
- Password: `password123`

## 🎯 Features

### Customer Features
- Product browsing and search
- Shopping cart management
- User registration and login
- Profile management
- Responsive design

### Admin Features
- Dashboard with statistics
- Product management (CRUD)
- Customer management
- User management with privileges
- Image upload for products

### UI Features
- Light/Dark mode toggle
- Fully responsive design
- Modern, clean interface
- Loading states and error handling
- Form validation

## 📱 Pages & Routes

### Public Pages
- `/` - Home page with products
- `/login` - Customer login
- `/register` - Customer registration
- `/products` - Product listing
- `/products/[id]` - Product details

### Customer Pages
- `/profile` - Customer profile
- `/cart` - Shopping cart

### Admin Pages
- `/admin-login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/customers` - Customer management
- `/admin/users` - User management

## 🛠 Technology Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Context + Custom Hooks
- **HTTP Client:** Custom Fetch wrapper
- **Icons:** Lucide React
- **Theme:** Light/Dark mode support

## 📁 Project Structure

```
app/
├── (customer)/             # Customer pages
├── admin/                  # Admin pages
├── globals.css            # Global styles
└── layout.js              # Root layout

components/
├── admin/                 # Admin components
├── customer/              # Customer components
├── common/                # Shared components
└── ui/                    # UI components

lib/
├── api.js                 # API functions
├── constants.js           # App constants
└── utils.js               # Utility functions
```

## 🎨 Design Features

- **Responsive Design:** Mobile-first approach
- **Modern UI:** Clean, professional interface
- **Dark Mode:** Complete theme switching
- **Animations:** Smooth transitions and interactions
- **Accessibility:** ARIA labels and keyboard navigation

## 🔧 Development

### Build for production
```bash
npm run build
npm start
```

### Lint code
```bash
npm run lint
```
---

**Developed by:** Yahampath Chandika  
**Email:** yhmpth@gmail.com

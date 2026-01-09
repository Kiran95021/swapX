# SwapX

**The Campus Marketplace Built for Students**

SwapX is a modern, mobile-first marketplace platform designed exclusively for university students. Buy, sell, swap, and rent items within your campus community—completely free, trusted, and secure.

---

## 🎯 Problem Statement

Students frequently purchase items that are used for only a short period—textbooks, electronics, furniture, and more. When it's time to move on, selling these items becomes a hassle:

- **Existing marketplaces** (Craigslist, Facebook Marketplace) aren't optimized for campus life
- **Trust is an issue** when dealing with strangers outside your community  
- **No dedicated platform** exists for student-to-student commerce
- **High fees** on other platforms eat into already-tight student budgets

---

## 💡 Solution

SwapX provides a **campus-focused marketplace** where students can:

- **List items** for sale, swap, rent, or give away for free
- **Browse products** posted by verified fellow students  
- **Connect directly** with sellers/buyers via in-app messaging
- **Transact locally** within the trusted campus ecosystem

All of this with **zero fees**, **campus-email verification**, and a **modern, intuitive interface**.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🛒 **Multi-Mode Listings** | Sell, swap, rent, or give away items |
| 🔒 **Campus Verification** | Only .edu/.ac emails allowed for trust |
| 💬 **Real-time Messaging** | Chat directly with buyers and sellers |
| ❤️ **Favorites & Wishlists** | Save items and get alerts when matches appear |
| 📱 **Mobile-First Design** | Optimized for on-the-go student life |
| 🎨 **Dark/Light Mode** | Comfortable viewing in any environment |
| 🔍 **Smart Search & Filters** | Find what you need quickly |
| 📊 **User Profiles** | Track your listings, sales, and reputation |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Animations** | Framer Motion |
| **Backend** | Lovable Cloud (Supabase) |
| **Authentication** | Email-based with campus verification |
| **Real-time** | WebSocket subscriptions for messaging |
| **State Management** | TanStack Query |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Local Development

```bash
# Clone the repository
git clone https://github.com/Kiran95021/swapX.git
cd swapX

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
swapX/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Shared components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # shadcn/ui primitives
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # External service integrations
│   ├── lib/             # Utility functions
│   ├── pages/           # Route pages
│   └── types/           # TypeScript definitions
├── supabase/            # Backend configuration
└── package.json
```

---

## 🌐 Deployment

SwapX is deployment-ready for modern platforms:

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the `dist` folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "run", "preview"]
```

---

## 🔐 Environment Variables

The following environment variables are required:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

---

## 📝 License

MIT License - feel free to use this project for learning or building your own campus marketplace.

---

## 👤 Author

**Kiran**

- GitHub: [@Kiran95021](https://github.com/Kiran95021)

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide Icons](https://lucide.dev/) for the icon set

---

<p align="center">
  Made with ❤️ for students, by students
</p>
